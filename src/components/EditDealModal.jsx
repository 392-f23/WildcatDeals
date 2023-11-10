import React, { useState, useEffect, useRef } from 'react';
import { Button as NextUIButton, Modal, ModalHeader, ModalBody, ModalFooter, useDisclosure, ModalContent } from "@nextui-org/react";
import { writeToDb } from "../utilities/firebase";
import { JSONEditor } from 'vanilla-jsoneditor';
import { Button } from '@mui/material';

const EditDealModal = ({ deal }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [content, setContent] = useState({ json: deal || {} });
    const editorRef = useRef(null);
    const jsonEditorRef = useRef(null);

    useEffect(() => {
        setContent({ json: deal });
    }, [deal]);

    useEffect(() => {
        if (isOpen && !jsonEditorRef.current) {
            jsonEditorRef.current = new JSONEditor({
                target: editorRef.current,
                props: {
                    content,
                    onChange: handleChange
                }
            });
        }

        // Clean up on component unmount or before re-initializing the editor
        return () => {
            if (jsonEditorRef.current) {
                jsonEditorRef.current.destroy();
                jsonEditorRef.current = null;
            }
        };
    }, [isOpen, content]); // Re-initialize when isOpen or content changes

    const handleChange = (updatedContent) => {
        setContent(updatedContent);
    };

    const handleSave = async () => {
        try {
            // Save the updated deal to the database
            await writeToDb(`/businesses/${deal.id - 1}`, content.json);
            // Notify the user that the deal was updated
            alert("Deal updated successfully!");
            onOpenChange(false);
            // Refresh the page to reflect the updated deal
            window.location.reload();
        } catch (error) {
            console.error("Error updating deal:", error);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color='error'
                onClick={onOpen}
                fullWidth
                sx={{ mt: 2 }}
            >
                Edit Deal
            </Button>
            <Modal isOpen={isOpen} onClose={onOpenChange} size="4xl">
                <ModalContent>
                    <ModalHeader>Edit Deal</ModalHeader>
                    <ModalBody>
                        <div ref={editorRef} id="jsoneditor"></div>
                    </ModalBody>
                    <ModalFooter>
                        <NextUIButton
                            variant="light"
                            color='warning'
                            onPress={onOpenChange}
                            className="rounded-md"
                        >
                            Cancel
                        </NextUIButton>
                        <NextUIButton
                            color='danger'
                            onPress={handleSave}
                            className="rounded-md"
                        >
                            Save
                        </NextUIButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditDealModal;
