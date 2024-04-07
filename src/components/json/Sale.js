export const Sale = {
    getData() {
        return [
            {
                itemImageSrc: 'https://www.arhipro.com/storage/ref/EMS,%20Belgrade/16.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria1s.jpg',
                alt: 'Војводе степе 412 Сала 1',
                title: 'Сала 1'
            },
            {
                itemImageSrc: '	https://www.arhipro.com/storage/ref/EMS,%20Belgrade/17.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria2s.jpg',
                alt: 'Војводе степе 412  Сала 2',
                title: 'Сала 2'
            },
            {
                itemImageSrc: '	https://www.arhipro.com/storage/ref/EMS,%20Belgrade/21.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria3s.jpg',
                alt: 'Војводе степе 412  Сала 3',
                title: 'Сала 3'
            },
            {
                itemImageSrc: '	https://www.arhipro.com/storage/ref/EMS,%20Belgrade/26.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria4s.jpg',
                alt: 'Војводе степе 412  Сала 4',
                title: 'Сала 4'
            },
            {
                itemImageSrc: 'https://www.arhipro.com/storage/ref/EMS,%20Belgrade/16.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria1s.jpg',
                alt: 'Војводе степе 412  Сала 1',
                title: 'Сала 1'
            },
            {
                itemImageSrc: '	https://www.arhipro.com/storage/ref/EMS,%20Belgrade/17.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria2s.jpg',
                alt: 'Војводе степе 412  Сала 2',
                title: 'Сала 2'
            },
            {
                itemImageSrc: '	https://www.arhipro.com/storage/ref/EMS,%20Belgrade/21.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria3s.jpg',
                alt: 'Војводе степе 412  Сала 3',
                title: 'Сала 3'
            },
            {
                itemImageSrc: '	https://www.arhipro.com/storage/ref/EMS,%20Belgrade/26.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria4s.jpg',
                alt: 'Војводе степе 412  Сала 4',
                title: 'Сала 4'
            }
        ];
    },

    getImages() {
        return Promise.resolve(this.getData());
    }
};

