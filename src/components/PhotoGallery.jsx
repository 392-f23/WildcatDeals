import React, { useState } from "react";
import { Gallery } from "react-grid-gallery";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const PhotoGallery = ({ images }) => {
    if (!images || images.length === 0) {
        return null;
    }
    const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imagesForGallery =
        (images || []).map(image => ({
            src: image,
            original: image,
            thumbnail: image,
            width: "auto",
            height: "auto",
      thumbnailWidth: "auto",
      thumbnailHeight: "auto",
        })
        );

    const lightboxImages = imagesForGallery.map(({ src }) => ({ src }));

    const openLightbox = (index, event) => {
        setCurrentImageIndex(index);
        setLightboxIsOpen(true);
    };

    return (<>
        <Gallery
            images={imagesForGallery}
            enableImageSelection={false}
            onClick={openLightbox}
            rowHeight={80}
        />
        <Lightbox
            slides={lightboxImages}
            open={lightboxIsOpen}
            index={currentImageIndex}
            close={() => setLightboxIsOpen(false)}
            plugins={[Fullscreen, Thumbnails]}
            carousel={{
                imageFit: "cover",
                finite: true,
              }}
            render={{
                buttonPrev: images.length > 1 ? undefined : () => null,
                buttonNext: images.length > 1 ? undefined : () => null,
            }}
        />
    </>
    );
};

export default PhotoGallery;