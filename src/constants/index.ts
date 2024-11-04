import NetworkConstants from "./networkConstants";
import EncryptionConstants from "./encryptionConstants";
import RoleConstants from "./roleConstants";
import ExceptionalMessageConstants from "./exceptionalMessages";
import ExcludeUrlSpecialCharaters from "./escapeSequenceConstants";

const K = {
  Network: NetworkConstants,
  EncryptionConstants: EncryptionConstants,
  Roles: RoleConstants,
  exceptionalMessages: ExceptionalMessageConstants,
  excludeUrlSpecialCharaters: ExcludeUrlSpecialCharaters,
  
};

export default K;
