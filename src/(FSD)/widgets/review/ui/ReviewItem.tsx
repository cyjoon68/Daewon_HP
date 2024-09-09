import React, { useEffect, useReducer, useState } from "react";
import styles from "@/(FSD)/shareds/styles/ReviewStyle.module.scss";
import type { ReviewType } from "../../../shareds/types/Review.type";
import { useRouter } from "next/navigation";
import { useReplyListRead } from "@/(FSD)/entities/reply/api/useReplyListRead";
import { ReplyType } from "@/(FSD)/shareds/types/Reply.type";
import { useReviewDelete } from "@/(FSD)/features/review/api/useReviewDelete";
import ItemShared from "@/(FSD)/shareds/ui/ItemShared";
import TextLargeShared from "@/(FSD)/shareds/ui/TextLargeShared";
import TextBoxShared from "@/(FSD)/shareds/ui/TextBoxShared";
import TextMediumShared from "@/(FSD)/shareds/ui/TextMediumShared";
import StarListShared from "@/(FSD)/shareds/ui/StarListShared";
import MenuBarShared from "@/(FSD)/shareds/ui/MenuBarShared";
import { DropdownItem } from "@nextui-org/dropdown";
import ReplyShared from "@/(FSD)/shareds/ui/ReplyShared";

const ReviewItem = ({ review, parentRefetch, grandParentFetch, isWriter = false }: { review: ReviewType; parentRefetch?: any; grandParentFetch?: any; isWriter?: boolean }) => {
    const [isViewReply, toggleViewReply] = useReducer((state) => !state, true);
    const router = useRouter();

    if (!review) return <></>;
    
    const { data, refetch } = useReplyListRead(review.reviewId);

    const replyList: ReplyType[] = data;

    useEffect(() => {
        refetch();
    }, [review]);

    const onSuccess = (data: any) => {
        if (parentRefetch) {
            parentRefetch();
        }

        if (grandParentFetch) {
            grandParentFetch();
        }
    };
    const { mutate } = useReviewDelete({ onSuccess });

    return (
        <div onClick={_ => router.push(`/reply/create?reviewId=${review.reviewId}`)} className={styles.review_item}>
            <ItemShared>
                <div className={styles.review_inner}>
                    <div className={styles.review_header}>
                        <div className={styles.top_item}>
                            <TextLargeShared>{review.userName}님</TextLargeShared>
                            {isWriter &&
                                <div className={styles.writer_item}>
                                    <MenuBarShared path={`/review/update?reviewId=${review.reviewId}`} mutate={mutate} id={review.reviewId}>
                                        <DropdownItem onClick={toggleViewReply}>{isViewReply ? "답글 숨기기" : "답글 보기"}</DropdownItem>
                                    </MenuBarShared>
                                </div>
                            }
                        </div>
                        <div className={styles.btm_item}>
                            <StarListShared star={review.star} />
                            <TextMediumShared>{review.createAt}</TextMediumShared>
                        </div>
                    </div>
                    <div className={styles.review_content}>
                        <div className={styles.text_content}>
                            <TextLargeShared>{review.reviewTitle}</TextLargeShared>
                            <TextBoxShared><TextMediumShared>{review.reviewText}</TextMediumShared></TextBoxShared>
                        </div>
                        {review.reviewImage && (
                            <div className={styles.img_content}><img alt={"review_img"} src={`data:image/png;base64,${review.reviewImage}`} /></div>
                        )}
                    </div>
                </div>
                {
                    (isViewReply && replyList) && replyList.map(reply => (
                        <React.Fragment key={reply.replyId}>
                            <ReplyShared parentRefetch={parentRefetch} reply={reply} isWriter={reply.reply} />
                        </React.Fragment>
                    ))
                }
            </ItemShared>
        </div>
    );
};

export default ReviewItem;