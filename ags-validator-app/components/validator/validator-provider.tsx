import StoreProvider from "./store-provider";
import Validator from "./validator";

export default function ValidatorProvider() {
  return (
    <StoreProvider>
      <Validator />
    </StoreProvider>
  );
}
