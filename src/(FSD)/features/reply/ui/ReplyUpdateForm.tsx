"use client";

import React from "react";
import { useReplyUpdate } from "../api/useReplyUpdate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import InnerShared from "@/(FSD)/shareds/ui/InnerShared";
import FormTextareaShared from "@/(FSD)/shareds/ui/FormTextareaShared";
import { Button } from "@nextui-org/button";
import styles from "@/(FSD)/shareds/styles/ReplyStyle.module.scss";
import { useReplyRead } from "@/(FSD)/entities/reply/api/useReplyRead";
import { ReplyType } from "@/(FSD)/shareds/types/Reply.type";
import useUserStore from "@/(FSD)/shareds/stores/useUserStore";

const ReplyUpdateForm = () => {
    const searchParams = useSearchParams();
    const replyId = +searchParams.get("replyId")!;
    const { isLoggedIn } = useUserStore();

    const { data } = useReplyRead(replyId);

    const reply: ReplyType = data;

    const schema = z.object({
        replyText: z.string().min(10).max(200)
    });
    
    const { control, handleSubmit, formState: { errors, isValid, submitCount } } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange"
    });
    
    const onSuccess = (data: any) => {

    }
    
    const { mutate } = useReplyUpdate({ onSuccess });
    
    const onSubmit = (data: any) => {
        mutate({ replyId: replyId, replyText: data.replyText });
    }

    if(!reply) return <></>;
    if(!isLoggedIn) return <></>;
    if(!reply.reply) return <></>;

    return (
        <form className={styles.reply_form} onSubmit={handleSubmit(onSubmit)}>
            <InnerShared>
                <FormTextareaShared placeholder={reply.replyText} isInvalid={!!errors.replyText} size={"lg"} control={control} name={"replyText"} />
                <Button isDisabled={!isValid} type={"submit"} color={"primary"} fullWidth size={"lg"}>수정하기</Button>
            </InnerShared>
        </form>
    );
};

export default ReplyUpdateForm;