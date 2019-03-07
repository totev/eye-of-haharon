import { AzureResultObject } from './AzureResultObject';
import { ProviderResult } from './provider-result';

export class AzureResult implements ProviderResult {
  public objects: AzureResultObject[] = [];
}
