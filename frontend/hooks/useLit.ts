// hooks/useLit.ts
import { useState } from 'react';
import { litClient } from '../utils/lit';

export const useLit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = async (content: string, accessControlConditions: any[]) => {
    setLoading(true);
    setError(null);
    try {
      await litClient.connect();
      const result = await litClient.encrypt(
        content,
        accessControlConditions
      );
      console.log('result:', result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
      await litClient.disconnect();
    }
  };

  const decrypt = async (
    encryptedContent: string,
    encryptedSymmetricKey: string,
    accessControlConditions: any[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      await litClient.connect();
      console.log(encryptedContent,encryptedSymmetricKey,accessControlConditions)
      const decrypted = await litClient.decrypt(
        encryptedContent,
        encryptedSymmetricKey,
        accessControlConditions
      );
      return decrypted;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
      await litClient.disconnect();
    }
  };

  return {
    encrypt,
    decrypt,
    loading,
    error,
  };
};
