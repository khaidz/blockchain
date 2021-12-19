import renderAuthorize from './renderAuthorize';
import Authorized from './Authorized';
import Secured from './Secured';
import check from './CheckPermissions';

Authorized.Secured = Secured;
Authorized.check = check;
const RenderAuthorize = renderAuthorize(Authorized);
export default RenderAuthorize;
