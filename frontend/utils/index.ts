export function formatEthereumAddress(address: string): string {
  // 移除前导零
  const strippedAddress = address.replace(/^0x0+/g, '0x');

  // 转换为标准格式，首字母小写，其他字母与原地址保持大小写
  const checksumAddress = toChecksumAddress(strippedAddress);

  return checksumAddress;
}

// 使用以太坊的 Keccak-256 哈希算法来生成校验和地址
import { keccak256 } from 'js-sha3';

function toChecksumAddress(address: string): string {
  address = address.toLowerCase().replace('0x', '');
  const hash = keccak256(address);
  let checksumAddress = '0x';

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }

  return checksumAddress;
}
