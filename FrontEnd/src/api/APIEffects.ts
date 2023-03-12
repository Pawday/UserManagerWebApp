import {createEffect} from "effector";
import {OptionGroupWithOptions, UserRequiredData, UserWithFullInfo} from "./ApiTypes";


export const userPreviewsLoadFx = createEffect<void,Array<UserRequiredData>>("load_all_users_effect");
export const userDeleteFx = createEffect<UserRequiredData, boolean>("user_delete_effect");
export const optionsLoadFx = createEffect<void, Array<OptionGroupWithOptions> | null>("load_all_options_grouped_effect");
export const addUserWithFullInfoFx = createEffect<UserWithFullInfo, boolean>("add_user_with_full_info_effect");