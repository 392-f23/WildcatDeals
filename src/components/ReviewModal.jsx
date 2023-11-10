import React, { useState, useEffect } from 'react';
import { Button as NextUIButton, Popover, Modal, ModalHeader, ModalBody, ModalFooter, useDisclosure, ModalContent, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { Avatar, Rating, TextField } from '@mui/material';
import { writeToDb, getDbData, removeDbData } from "../utilities/firebase";
import useEventStore from "../utilities/stores";
import { AddAPhotoOutlined, InfoOutlined, RateReviewOutlined } from '@mui/icons-material';
import { DropzoneArea } from "mui-file-dropzone";
import UploadOneImage from '../utilities/UploadOneImage';


const ReviewModal = ({ deal, fetchReviews }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [rating, setRating] = useState(0);
    const [initialRating, setInitialRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [initialReviewText, setInitialReviewText] = useState('');
    const [error, setError] = useState('');
    const user = useEventStore((state) => state.user);
    const [files, setFiles] = useState([]);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [userReviewed, setUserReviewed] = useState(false);

    // Function to fetch the existing review
    const fetchUserReview = async () => {
        const reviewsPath = `/reviews/${deal.id}/user_reviews/${user.uid}`;
        const userReview = await getDbData(reviewsPath);
        if (userReview) {
            setRating(userReview.rating || 0);
            setInitialRating(userReview.rating || 0);
            setReviewText(userReview.text || '');
            setInitialReviewText(userReview.text || '');
            setUserReviewed(true);
        } else {
            setUserReviewed(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserReview();
        }
    }, [user]);

    const handleClose = () => {
        onOpenChange(false);
        setError('');
        setRating(0);     // Reset the rating to initial value
        setReviewText(''); // Reset the review text to initial value
        fetchReviews(); // Fetch reviews again
        fetchUserReview();
        setShowImageUpload(false);
    };

    const handleDelete = async () => {
        // ask for confirmation
        if (!window.confirm('Are you sure you want to delete your review?')) {
            return;
        }

        const reviewsPath = `/reviews/${deal.id}`;
        try {
            // first, recalculate the average rating
            const currentReviews = await getDbData(`/reviews/${deal.id}`);
            let newAverage;
            let totalRating = 0;
            let numberOfReviews = 0;

            if (currentReviews && currentReviews.user_reviews) {
                Object.entries(currentReviews.user_reviews).forEach(([userId, userReview]) => {
                    if (userId !== user.uid) {
                        totalRating += userReview.rating;
                        numberOfReviews++;
                    }
                }
                );
            }

            newAverage = totalRating / numberOfReviews;
            // guard against NaN
            if (isNaN(newAverage)) {
                newAverage = 0;
            }

            const userReviewUpdate = {
                average: newAverage,
                time: Date.now(),
                [`user_reviews/${user.uid}`]: null,
            };

            await writeToDb(reviewsPath, userReviewUpdate);
            handleClose();
        } catch (error) {
            console.error("Error deleting review:", error);
            setError('An error occurred while deleting your review. Please try again.');
        }
    };

    const submitReview = async () => {
        if (rating <= 0) {
            setError('Please select a star rating.');
            return;
        }

        // Check if there are changes
        if (rating === initialRating && reviewText === initialReviewText && files.length === 0) {
            setError('No changes have been made.');
            return;
        }

        if (user) {
            const reviewsPath = `/reviews/${deal.id}`;
            try {
                const currentReviews = await getDbData(reviewsPath);
                let newAverage;
                let totalRating = rating;
                let numberOfReviews = 1;

                if (currentReviews && currentReviews.user_reviews) {
                    Object.entries(currentReviews.user_reviews).forEach(([userId, userReview]) => {
                        if (userId !== user.uid) {
                            totalRating += userReview.rating;
                            numberOfReviews++;
                        }
                    });
                }

                newAverage = totalRating / numberOfReviews;

                const userReviewUpdate = {
                    average: newAverage,
                    time: Date.now(),
                    [`user_reviews/${user.uid}/rating`]: rating,
                    ...(reviewText ? { [`user_reviews/${user.uid}/text`]: reviewText } : {}),
                    // Update the time only if there are changes
                    ...(rating !== initialRating || reviewText !== initialReviewText
                        ? { [`user_reviews/${user.uid}/time`]: new Date().toISOString() }
                        : {}),
                };

                // If the user submits an empty text review, delete the existing one.
                if (initialReviewText && !reviewText) {
                    userReviewUpdate[`user_reviews/${user.uid}/text`] = null;
                }

                // Upload images to Firebase Storage
                if (files.length > 0) {
                    const imageUrls = await Promise.all(files.map((imageBlob) => {
                        return UploadOneImage(imageBlob, "user_reviews", user.uid);
                    }));

                    // Assuming userReviewUpdate is an object that you will later use to update some state.
                    userReviewUpdate[`user_reviews/${user.uid}/images`] = imageUrls.filter(url => url != null);
                }

                await writeToDb(reviewsPath, userReviewUpdate);
                fetchUserReview();
                handleClose();
            } catch (error) {
                console.error("Error submitting review:", error);
                setError('An error occurred while submitting your review. Please try again.');
            }
        } else {
            setError('You must be logged in to submit a review.');
        }
    };

    return (
        <>
            <NextUIButton onPress={onOpen} startContent={<RateReviewOutlined className='text-[#4e2a84]' />} variant="bordered" className=" hover:bg-[#EEE4FF] text-black py-2 px-4 rounded-3xl">
                {userReviewed ? 'Edit Review' : 'Write a Review'}
            </NextUIButton>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="4xl"
                scrollBehavior="inside"
                isDismissable={false}
            >
                <ModalContent>
                    <ModalHeader>
                        {deal.name}
                    </ModalHeader>
                    <ModalBody>
                        <div className='flex gap-3'>
                            <Avatar src={user?.photoURL} size="lg" />
                            <div className="flex flex-col">
                                <p className="text-md">{user?.displayName}</p>
                                <div className="flex flex-row gap-1">
                                    <p className="text-small text-default-500">Posting Publicly</p>
                                    <Popover placement="bottom" showArrow={true}>
                                        <PopoverTrigger>
                                            <NextUIButton
                                                isIconOnly
                                                className="data-[hover]:bg-foreground/5 text-slate-600 -translate-y-2.5 -translate-x-2 text-xs"
                                                radius="full"
                                                variant="light"
                                            >
                                                <InfoOutlined />
                                            </NextUIButton>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="p-4">
                                                <div className="text-small font-bold">Your posts will appear publicly with your profile name and picture.</div>
                                                <div className="text-tiny">Your posts will appear on third-party services across the web, like Maps and Search. This is out of our control.</div>
                                                <div className="text-tiny">Your posts must comply with Northwestern University's Acceptable Use Policy.</div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <div className="justify-center flex">
                            <Rating
                                name="simple-controlled"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                    setError(''); // Clear error when rating is selected
                                }}
                                size="large"
                            />
                        </div>
                        <TextField
                            fullWidth
                            size="lg"
                            placeholder="Share details of your own experience at this place"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            multiline
                            rows={6}
                        />
                        {!showImageUpload ?
                            <div className="justify-center flex">
                                <NextUIButton startContent={<AddAPhotoOutlined />} variant="bordered" className="hover:bg-[#EEE4FF] text-[#4e2a84] py-2 px-4 rounded-3xl w-96" onClick={() => setShowImageUpload(!showImageUpload)}>
                                    Add Photos
                                </NextUIButton>
                            </div>
                            :
                            <DropzoneArea
                                acceptedFiles={["image/*"]}
                                dropzoneText={"Click here to add images"}
                                filesLimit={5}
                                onChange={(files) => {
                                    setFiles(files);
                                }}
                                maxFileSize={30000000}
                            />
                        }
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </ModalBody>
                    <ModalFooter>
                        <NextUIButton color="danger" variant="light" onPress={handleClose} className="rounded-md">
                            Cancel
                        </NextUIButton>
                        {userReviewed &&
                            <NextUIButton color="danger" onPress={handleDelete} className="rounded-md">
                                Delete
                            </NextUIButton>
                        }
                        <NextUIButton onPress={submitReview} className="bg-[#4E2A84] hover:bg-[#4E2A84] text-white font-bold py-2 px-4 rounded-md" isDisabled={rating <= 0}>
                            {userReviewed ? 'Update' : 'Post'}
                        </NextUIButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ReviewModal;
