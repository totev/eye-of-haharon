import { ProviderDetails } from './provider-details';
export type CloudProvider = 'aws' | 'google' | 'azure';

export class GenericProvider {
  constructor(
    public url: URL,
    public details: ProviderDetails,
    public key: CloudProvider,
    public name: string,
  ) {}
}
