import {createEffect} from "effector";
import {UserRestrictedData} from "../editScreen/EditScreenStores";
import {OptionGroupWithOptions} from "./ApiTypes";


export const userPreviewsLoadFx = createEffect<void,Array<UserRestrictedData>>("load_all_users_effect");
export const userDeleteFx = createEffect<UserRestrictedData, boolean>("user_delete_effect");
export const optionsLoadFx = createEffect<void, Array<OptionGroupWithOptions> | null>("load_all_options_grouped_effect");