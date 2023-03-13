import {createEffect} from "effector";
import {OptionGroupWithOptions, UserRequiredData, UserWithFullInfo} from "./ApiTypes";


export const userPreviewsLoadFx = createEffect<void,Array<UserRequiredData>>("API_load_all_users_effect");
export const userDeleteFx = createEffect<UserRequiredData, boolean>("API_user_delete_effect");
export const optionsLoadFx = createEffect<void, Array<OptionGroupWithOptions> | null>("API_load_all_options_grouped_effect");
export const addUserWithFullInfoFx = createEffect<UserWithFullInfo, boolean>("API_add_user_with_full_info_effect");
export const loadFullUserInfoFx = createEffect<string, UserWithFullInfo | null>("API_load_full_user_effect");
