// app/api/extract-info/route.ts
import { extract_rental_contract, systemPrompt } from '@/utils/prompt';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { images } = await request.json();

		if (!images.length) {
			return NextResponse.json(
				{ error: 'IPFS hash is required' },
				{ status: 400 }
			);
		}

		const messages = [
			{
				role: 'system',
				content: [
					{
						type: 'text',
						text: systemPrompt,
					},
				],
			},
			{
				role: 'user',
				content: images.map((ele: string) => ({
					type: 'image_url',
					image_url: {
						url: ele,
					},
				})),
			},
		];

		const response = await fetch(
			`${process.env.OPENAI_API_PROXY}/chat/completions`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
				body: JSON.stringify({
					model: 'gpt-4o',
					messages,
					functions: [extract_rental_contract],
					function_call: { name: 'extract_rental_contract' },
					temperature: 0,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			console.error('OpenAI API error:', errorData);
			return NextResponse.json(
				{ error: 'Failed to process image' },
				{ status: response.status }
			);
		}

		const data = await response.json();

		try {
			const functionCallResult = JSON.parse(
				data.choices[0].message.function_call.arguments
			);
			return NextResponse.json(functionCallResult);
		} catch (error) {
			console.error('Error parsing function call result:', error);
			return NextResponse.json(
				{ error: 'Failed to parse OpenAI response' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('API route error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
