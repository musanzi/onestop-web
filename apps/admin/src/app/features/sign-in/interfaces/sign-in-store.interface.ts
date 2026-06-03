import { SigninPayloadInterface } from './sign-in.interface';

export interface SignInStoreInterface {
  isLoading: boolean;
}

export interface SignInParamsInterface {
  payload: SigninPayloadInterface;
  redirectPath: string;
  onSuccess: () => void;
}
