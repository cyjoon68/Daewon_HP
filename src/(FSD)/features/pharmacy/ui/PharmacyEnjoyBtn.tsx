"use client";

import IconShared from "@/(FSD)/shareds/ui/IconShared";
import TextXlargeShared from "@/(FSD)/shareds/ui/TextXlargeShared";
import { Button } from "@nextui-org/button";
import React, { useEffect } from "react";
import { usePharmacyEnjoyToggle } from "../api/usePharmacyEnjoyToggle";
import styles from "@/(FSD)/shareds/styles/Pharmacy.module.scss";
import useUserStore from "@/(FSD)/shareds/stores/useUserStore";

const PharmacyEnjoyBtn = ({ phId, children, defaultLikeActive = false, parentRefetch }: { defaultLikeActive?: boolean; phId: number; children?: React.ReactNode; parentRefetch?: any}) => {
    useEffect(() => {}, [defaultLikeActive]);

    const onSuccess = (data: any) => {
        if(parentRefetch) {
            parentRefetch();
        }
    };

    const { mutate } = usePharmacyEnjoyToggle({ onSuccess });

    const { isLoggedIn } = useUserStore();

    if(!isLoggedIn) return <></>;

    return (
        <Button onClick={_ => mutate(phId)} isIconOnly size={"sm"} variant={"light"} className={defaultLikeActive ? styles.active_like : ""} endContent={<TextXlargeShared><IconShared iconType={"like"} />{children}</TextXlargeShared>} />
    )
}

export default PharmacyEnjoyBtn;