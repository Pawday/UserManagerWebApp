import {createEffect} from "effector";
import {UserOverviewDataRow} from "../editScreen/EditScreenStores";


export const userPreviewsLoadFx = createEffect<null,Array<UserOverviewDataRow>>("load_users");