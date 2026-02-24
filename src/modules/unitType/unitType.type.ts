import { BaseTypes } from "@/common/models/base.model";

export type unitTypeResponse = BaseTypes & {
    code: string,
    label: string,
    isActive: Boolean,
}