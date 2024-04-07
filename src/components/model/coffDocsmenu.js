import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { CoffDocsService } from "../../service/model/CoffDocsService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker } from 'primereact/colorpicker';

const Order = (props) => {
    console.log(props, "##################### CoffDocmenu ###############################")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    // const currCoffOrder = localStorage.getItem('currCoffOrder')
    let i = 0
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticCena, setCoffDocs] = useState(props.ticCena);
    const [submitted, setSubmitted] = useState(false);
    const [ddCoffDocstpItem, setDdCoffDocstpItem] = useState(null);
    const [ddCoffDocstpItems, setDdCoffDocstpItems] = useState(null);
    const [ticCenatpItem, setCoffDocstpItem] = useState(null);
    const [ticCenatpItems, setCoffDocstpItems] = useState(null);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [loading, setLoading] = useState(false);

    const calendarRef = useRef(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];
    const [coffValue, setCoffValue] = useState();
    const [coffValues, setCoffValues] = useState([]);

    // const data = [
    //     { id: 1, um: 1, name: 'Espreso', izlaz: '0', img: 'assets/img/menu/1.jpg', description: '', num: 'Kом', docsid: null },
    //     { id: 2, um: 2, name: 'Domaca', izlaz: '0', img: 'assets/img/menu/1.jpg', description: '', num: 'Чаша', docsid: null },
    // ]
    // const [coffValues, setCoffValues] = useState(data);



    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const coffDocsService = new CoffDocsService();

                    const data = await coffDocsService.getDocsorder(props.artCurr.id, props.docId);
                    await setCoffValues(data);

                    console.log("coffDocService.getMenu !!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!", data)
                    //initFilters(); 
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);


    // useEffect(() => {
    //     setDropdownItem(findDropdownItemByCode(props.ticCena.valid));
    // }, []);
    // Autocomplit>

    // const findDropdownItemByCode = (code) => {
    //     return items.find((item) => item.code === code) || null;
    // };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisibleCoffDocsmenu(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            // const ticCenaService = new CoffDocsService();
            // const data = await ticCenaService.postCoffDocs(ticCena);
            // ticCena.id = data
            // props.handleDialogClose({ obj: coffValues, cenaTip: props.cenaTip, refresh: true });
            // props.setVisibleCoffDocsmenu(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffDocs ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticCenaService = new CoffDocsService();

            await ticCenaService.putCoffDocs(ticCena);
            props.handleDialogClose({ obj: ticCena, cenaTip: props.cenaTip });
            props.setVisibleCoffDocsmenu(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffDocs ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };


    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "tp") {
                setDdCoffDocstpItem(e.value);
                const foundItem = ticCenatpItems.find((item) => item.id === val);
                setCoffDocstpItem(foundItem || null);
                ticCena.ntp = e.value.name
                ticCena.ctp = foundItem.code
            } else {
                setDropdownItem(e.value);
            }

        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticCena = { ...ticCena };
        _ticCena[`${name}`] = val;
        setCoffDocs(_ticCena);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };


    const handleValueChange = async (e, type, name, rowData, apsTabela) => {

        let val = e.value;
        let _coffValue = {}
        const updatedtCoffValues = [...coffValues];

        const rowIndex = await updatedtCoffValues.findIndex((row) => row.id === rowData.id);

        updatedtCoffValues[rowIndex] = rowData;
        // console.log(e.value, name, "@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!#####!!!!!!!!!!!!!!!@@@@@@@@@@@@@@@@", updatedtCoffValues[rowIndex] , rowData)
        _coffValue = { ...updatedtCoffValues[rowIndex] };
        _coffValue[`${name}`] = val;
        await setCoffValue(_coffValue);
        updatedtCoffValues[rowIndex] = _coffValue;
        await setCoffValues(updatedtCoffValues);
        let newArray = []
        newArray[0] = updatedtCoffValues[rowIndex]
        await updateDataInDatabase(newArray);

        props.handleDialogClose({ obj: updatedtCoffValues, cenaTip: e.value, refresh: true });
    }

    const updateDataInDatabase = async (newObj) => {
        try {
            console.log(newObj, "@@@@@@@@@***********updateDataInDatabase************!!!!!!!!!!!!!!!!!!!!!")
            const coffDocsService = new CoffDocsService();
            const newId = await coffDocsService.postDocsorder(1, newObj, 1);
            props.onDataUpdate(newId);
            // Dodatno rukovanje ažuriranim podacima, ako je potrebno          
        } catch (err) {
            console.error('Error updating data:', err);
            // Dodatno rukovanje greškom, ako je potrebno
        }
    };

    const textBodyEditor = (rowData, field, e) => {
        //console.log(rowData, "##################@@@@@@@@@@@@@", field, "*************", e)
        return <InputNumber
            value={rowData.izlaz}
            // onValueChange={handleValueChange}
            showButtons
            buttonLayout="horizontal"
            step={1}
            inputStyle={{ fontSize: '1.7rem', textAlign: 'center', fontWeight: 'bold' }}
            size={3}
            decrementButtonClassName="p-button-danger"
            incrementButtonClassName="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            onChange={(e) => handleValueChange(e, 'input', 'izlaz', rowData, null)}
        />
    }
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="card">
                <div className="col-12 sm:col-6 lg:col-12 xl:col-12 p-2 clickable-item" >
                    <div className="p-4 border-1 surface-border surface-card border-round">
                        <div className="flex flex-column align-items-center gap-3 py-12">
                            <img src={props.artCurr.img} className="menu-img" style={{ cursor: 'pointer', maxWidth: '300px', maxHeight: '300px' }} />
                            <div className="text-2xl font-bold">{props.artCurr.name}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        dataKey="id"
                        selectionMode="single"
                        selection={coffValue}
                        loading={loading}
                        // coffValue={data}
                        value={coffValues}
                        showHeaders={false}
                    >
                        <Column
                            field="num"
                            style={{ width: '40%' }}
                            className="text-xl font-bold"
                        />

                        <Column
                            field="izlaz"

                            dataType="numeric"
                            style={{ width: '15%' }}
                            bodyClassName="text-center"
                            body={textBodyEditor}
                            bodyStyle={{ textAlign: 'center' }}
                        // onChange={(e) => onInputValueChange(e, 'input', 'coffValue', e.rowData, null)}
                        >
                        </Column>
                        <Column
                            style={{ width: '40%' }}
                        />
                    </DataTable>
                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? (
                            <Button
                                label={translations[selectedLanguage].Cancel}
                                // icon="pi pi-times"
                                // className="p-button-outlined p-button-secondary"
                                onClick={handleCancelClick}
                                className="p-button-raised p-button-secondary"
                                style={{ width: '100%', fontSize: '1.2rem' }}

                            />
                        ) : null}
                        <div className="flex-grow-1"></div>
                        {/* <div className="flex flex-wrap gap-1">
                            {(props.cenaTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.cenaTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.cenaTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Save}
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                        </div> */}
                    </div>
                </div>
            </div>
            {/* <DeleteDialog
                visible={deleteDialogVisible}
                inCoffDocs="delete"
                item={ticCena.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            /> */}
        </div>
    );
};

export default Order;
