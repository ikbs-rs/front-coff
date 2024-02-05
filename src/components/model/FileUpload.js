import React, { useRef } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import Token from "../../utilities/Token";
import FileService from "../../service/FileService";

export default function AutoDemo() {
    const toast = useRef(null);

    const handleCustomUpload = async (event) => {
        try {
            console.log('Custom upload started Bravo:', event);
            const file = event.files[0]
            const fileService = new FileService();
            const data = await fileService.uploadFile(file, event.files[0].name);
            toast.current.show({ severity: 'success', summary: 'Success', detail: data.message });
            event.options.clear();

        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error uploading file' });
        }
    }

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast}></Toast>
            <FileUpload
                name="Fajl"
                accept="image/*"
                maxFileSize={1000000}
                uploadHandler={handleCustomUpload}
                customUpload={true}
                chooseLabel="Browse"
                emptyTemplate={
                    <p className="m-0">Drag and drop files to here to upload.</p>
                  }
            />
        </div>
    );
}
