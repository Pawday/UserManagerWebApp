import {createEffect} from "effector";
import {UserRestrictedData} from "../editScreen/EditScreenStores";


export const userPreviewsLoadFx = createEffect<null,Array<UserRestrictedData>>("load_users");
export const userDeleteFx = createEffect<UserRestrictedData, boolean>("user_delete_effect");