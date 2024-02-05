import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventatttpService } from '../../service/model/TicEventatttpService';
import { TicEventattService } from '../../service/model/TicEventattService';
import { CmnPaymenttpService } from '../../service/model/cmn/CmnPaymenttpService';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from '../../configs/translations';

const TicEventatt = (props) => {
    console.log(props);
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticEventatt, setTicEventatt] = useState(props.ticEventatt);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnInputtp, setDdCmnInputtpItem] = useState(null);
    const [ddCmnInputtps, setDdCmnInputtpItems] = useState(null);
    const [cmnInputtpItem, setCmnInputtpItem] = useState(null);
    const [cmnInputtpItems, setCmnInputtpItems] = useState(null);

    const [ddTicEventatttpItem, setDdTicEventatttpItem] = useState(null);
    const [ddTicEventatttpItems, setDdTicEventatttpItems] = useState(null);
    const [ticEventatttpItem, setTicEventatttpItem] = useState(null);
    const [ticEventatttpItems, setTicEventatttpItems] = useState(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];
    const linktpValues = [
        { name: `${translations[selectedLanguage].No_connection}`, code: '0' },
        { name: `${translations[selectedLanguage].Paymenttp}`, code: '1' },
        { name: `${translations[selectedLanguage].Sales_channels}`, code: '2' }
      //  { name: 'Option 3', code: '3' }
    ];

    const [linktpItem, setLinktpItem] = useState(null);
    const [linktpItems, setLinktpItems] = useState([]);

    const [showDdCmnLinkItem, setShowDdCmnLinkItem] = useState(false);
    const [ddCmnLink, setDdCmnLink] = useState(null);
    const [ddCmnLinks, setDdCmnLinks] = useState(null);    
    const [ddCmnLinkItem, setDdCmnLinkItem] = useState(null);
    const [ddCmnLinkItems, setDdCmnLinkItems] = useState([]);


    useEffect(() => {
        console.log(props.ticEventatt.linktp, "@@@@@@@@@@@")
        setLinktpItem(findLinktpItemByCode(props.ticEventatt.linktp));
    }, []);

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticEventatt.valid));
    }, []);    

    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventattService = new TicEventattService();
                const data = await ticEventattService.getCmnInputtps();

                setCmnInputtpItems(data);
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnInputtpItems(dataDD);
                setDdCmnInputtpItem(dataDD.find((item) => item.code === props.ticEventatt.inputtp) || null);
                if (props.ticEventatt.att) {
                    const foundItem = data.find((item) => item.id === props.ticEventatt.inputtp);
                    setCmnInputtpItem(foundItem || null);
                    ticEventatt.ctp = foundItem.code;
                    ticEventatt.ntp = foundItem.textx;
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventatttpService = new TicEventatttpService();
                const data = await ticEventatttpService.getTicEventatttps();

                setTicEventatttpItems(data)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventatttpItems(dataDD);
                setDdTicEventatttpItem(dataDD.find((item) => item.code === props.ticEventatt.tp) || null);
                if (props.ticEventatt.tp) {
                    const foundItem = data.find((item) => item.id === props.ticEventatt.tp);
                    setTicEventatttpItem(foundItem || null);
                    ticEventatt.ctp = foundItem.code
                    ticEventatt.ntp = foundItem.text
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    const findLinktpItemByCode = (code) => {
        return linktpValues.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setLinktpItems(linktpValues);
    }, []);
    
    useEffect(() => {
        async function fetchData() {
            try {
                if (linktpItem.code != '0') {
                    console.log(linktpItem.code, "############################linktpItem###############################")
                    let data
                    if (linktpItem.code == '1') {
                        const ticEventattService = new CmnPaymenttpService();
                        data = await ticEventattService.getCmnPaymenttps();
                    } else if (linktpItem.code == '2') {
                        const ticEventattService = new TicEventattService();
                        data = await ticEventattService.getCmnObjs('XPK');
                    } else if (linktpItem.code == '3') {
                        const ticEventattService = new TicEventattService();
                        data = await ticEventattService.getCmnInputtps();                        
                    }
                    setDdCmnLinks(data);
                    const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                    setDdCmnLinkItems(dataDD);
                    setDdCmnLinkItem(dataDD.find((item) => item.code === props.ticEventatt.link) || null);
                    // if (props.ticEventatt.att) {
                    //     const foundItem = data.find((item) => item.id === props.ticEventatt.inputtp);
                    //     setCmnInputtpItem(foundItem || null);
                    //     ticEventatt.ctp = foundItem.code;
                    //     ticEventatt.ntp = foundItem.textx;
                    // }                    
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [linktpItem]);


    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const ticEventattService = new TicEventattService();
            const data = await ticEventattService.postTicEventatt(ticEventatt);
            ticEventatt.id = data;
            props.handleDialogClose({ obj: ticEventatt, eventattTip: props.eventattTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticEventattService = new TicEventattService();
            await ticEventattService.putTicEventatt(ticEventatt);
            props.handleDialogClose({ obj: ticEventatt, eventattTip: props.eventattTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticEventattService = new TicEventattService();
            await ticEventattService.deleteTicEventatt(ticEventatt);
            props.handleDialogClose({ obj: ticEventatt, eventattTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = '';
        if (type === 'options') {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == 'inputtp') {
                setDdCmnInputtpItem(e.value);
                ticEventatt.cinputtp = e.value.code;
                ticEventatt.ninputtp = e.value.name;
            } else if (name == "tp") {
                setDdTicEventatttpItem(e.value);
                const foundItem = ticEventatttpItems.find((item) => item.id === val);
                setTicEventatttpItem(foundItem || null);
                ticEventatt.ntp = e.value.name
                ticEventatt.ctp = foundItem.code
            } else if (name == "linktp") {
                setLinktpItem(e.value);
            } else if (name == "link") {
                console.log("########################link#############################", e.value)
                setDdCmnLinkItem(e.value);
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticEventatt = { ...ticEventatt };
        _ticEventatt[`${name}`] = val;
        if (name === `text`) _ticEventatt[`text`] = val;

        setTicEventatt(_ticEventatt);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus value={ticEventatt.code} onChange={(e) => onInputChange(e, 'text', 'code')} required className={classNames({ 'p-invalid': submitted && !ticEventatt.code })} />
                            {submitted && !ticEventatt.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={ticEventatt.text}
                                onChange={(e) => onInputChange(e, 'text', 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEventatt.text })}
                            />
                            {submitted && !ticEventatt.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddTicEventatttpItem}
                                options={ddTicEventatttpItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventatt.tp })}
                            />
                            {submitted && !ticEventatt.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="inputtp">{translations[selectedLanguage].inputtp} *</label>
                            <Dropdown
                                id="inputtp"
                                value={ddCmnInputtp}
                                options={ddCmnInputtps}
                                onChange={(e) => onInputChange(e, 'options', 'inputtp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventatt.inputtp })}
                            />
                            {submitted && !ticEventatt.inputtp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="ddlist">{translations[selectedLanguage].ddlist}</label>
                            <InputText
                                id="ddlist"
                                value={ticEventatt.ddlist}
                                onChange={(e) => onInputChange(e, 'text', 'ddlist')}
                            />
                        </div>

                        <div className="field col-12 md:col-7">
                            <label htmlFor="linktp">{translations[selectedLanguage].select_connection}</label>
                            <Dropdown
                                id="linktp"
                                value={linktpItem}
                                options={linktpItems}
                                onChange={(e) => {
                                    onInputChange(e, 'options', 'linktp');
                                    const selectedValue = e.value.code;
                                    setShowDdCmnLinkItem(selectedValue !== '0');
                                    setDdCmnLinkItem(null);
                                }
                                }
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventatt.linktp })}
                            />
                            {submitted && !ticEventatt.linktp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        {(showDdCmnLinkItem || ddCmnLinkItem) && (
                            <div className="field col-12 md:col-6">
                                <label htmlFor="link">{translations[selectedLanguage].Link}</label>
                                <Dropdown
                                    id="link"
                                    value={ddCmnLinkItem}
                                    options={ddCmnLinkItems}
                                    onChange={(e) => onInputChange(e, 'options', 'link')}
                                    optionLabel="name"
                                    placeholder="Select One"
                                    className={classNames({ 'p-invalid': submitted && !ticEventatt.link })}
                                />
                                {submitted && !ticEventatt.link && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                            </div>
                        )}
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown
                                id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, 'options', 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventatt.valid })}
                            />
                            {submitted && !ticEventatt.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.eventattTip === 'CREATE' ? <Button label={translations[selectedLanguage].Create} icon="pi pi-check" onClick={handleCreateClick} severity="success" outlined /> : null}
                            {props.eventattTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.eventattTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Save} icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inAction="delete" item={ticEventatt.text} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
        </div>
    );
};

export default TicEventatt;
