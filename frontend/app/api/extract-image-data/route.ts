// app/api/extract-info/route.ts
import { pinata } from '@/utils/pinata';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const IPFS_GATEWAYS = [
  process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL,
  'https://ipfs.io',
  'https://dweb.link',
  'https://cloudflare-ipfs.com',
].filter(Boolean) as string[];

async function getIpfsFolderContents(hash: string) {
  console.log('ipfsHash :', hash);

  try {
    const response = await pinata.gateways.get(hash.toString());

    const ipfsFolderContent = response.data as string;

    console.log('🍉🍉', ipfsFolderContent);

    const regex = /href="(\/ipfs\/[^"]+)"/g;

    const matches = [];
    let match;

    while ((match = regex.exec(ipfsFolderContent)) !== null) {
      matches.push(match[1]);
    }

    const targetFileUrls = matches.filter(
      (ele) => ele.includes('.') && !ele.includes('?filename=')
    );

    return targetFileUrls;
  } catch (error: any) {
    console.error(`Failed to fetch folder contents`, error);
    throw new Error(`Failed to fetch folder contents`, error);
  }
}

async function getIpfsImageAsBase64(fileName: string): Promise<string> {
  let lastError: Error | null = null;

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const ipfsUrl = `${gateway}${fileName}`;
      console.log('ipfsUrl', ipfsUrl);

      console.log('Trying gateway:', ipfsUrl);

      const response = await axios.get(ipfsUrl, {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'image/*',
        },
      });

      const contentType = response.headers['content-type'];
      if (!contentType?.startsWith('image/')) {
        throw new Error('Response is not an image');
      }

      const base64 = Buffer.from(response.data).toString('base64');

      console.log('base64', base64);

      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error(`Failed to fetch from ${gateway}:`, error);
      lastError = error as Error;
      continue;
    }
  }

  throw new Error(
    `Failed to fetch IPFS image from all gateways: ${lastError?.message}`
  );
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hash = searchParams.get('hash');

    if (!hash) {
      return NextResponse.json(
        { error: 'IPFS folder hash is required' },
        { status: 400 }
      );
    }

    const folderContents = await getIpfsFolderContents(hash);

    const imagesPromises = folderContents.map(async (fileHash: string) => {
      try {
        const base64Data = await getIpfsImageAsBase64(fileHash);
        return base64Data;
      } catch (error) {
        console.error(`Error processing:`, error);
        return {
          success: false,
        };
      }
    });

    const results = await Promise.allSettled(imagesPromises);

    return NextResponse.json({
      success: true,
      folderContents,
      results,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
