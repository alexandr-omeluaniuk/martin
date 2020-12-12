import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import DataService, { CONTENT_TYPE_FORM } from '../../../service/DataService';
import useMediaQuery from '@material-ui/core/useMediaQuery';

let dataService = new DataService();

const useStyles = makeStyles(theme => ({
    radioPosition: {
        display: 'flex',
        justifyContent: 'center'
    },
    processText: {
        paddingRight: theme.spacing(3)
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    }
}));

function DialogCreateNewProcess (props) {
    const { processOptions, processes, info, onUpdate, openCreateProcess, openProcessTextField, openTextField } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const [selectedProcess, setSelectedProcess] = React.useState('');
    const [processText, setProcessText] = React.useState('');
    const [processDuration, setProcessDuration] = React.useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const handleChangeSelect = (event) => {
        setSelectedProcess(event.target.value);
    };
    const handleChangeProcessText = (event) => {
        setProcessText(event.target.value);
    };
    const handleChangeDuration = (event) => {
        setProcessDuration(parseInt(event.target.value) > 0 ? event.target.value : '');
    };
    const changeRadioValue = () => {
        if (openTextField) {
            setProcessText('');
            setProcessDuration('');
            openProcessTextField(false);
        } else {
            setSelectedProcess('');  
            openProcessTextField(true);
        }
    };
    const createNewServiceRow = () => {
        let currentProcess = processes.filter(p => {
            return p.recno === selectedProcess;
        })[0];
        let payload = {
            queue: info.queue.recno,
            process: currentProcess ? currentProcess.recno : null,
            processText: processText !== '' ? processText : null, 
            duration: processDuration !== '' ? processDuration : null
        };
        dataService.request('POST', '/ota/aufrufanlage/saveProcess', DataService.toFormString(payload), CONTENT_TYPE_FORM)
                .then(data => {
            onUpdate();
            setSelectedProcess('');
            setProcessText('');
            setProcessDuration('');
            openProcessTextField(false);
        });
        openCreateProcess();
    }
    
    return (
        <React.Fragment>
            {processOptions.length > 0 ? (
                <Grid container className={classes.marginBottom}>
                    <Grid item xs={1} className={classes.radioPosition}>
                        <FormControlLabel value="dropdown" control={<Radio checked={!openTextField} onChange={changeRadioValue}/>} />
                    </Grid>
                    <Grid item xs={!isMobile ? 9 : 11}>
                        <FormControl fullWidth>
                            <InputLabel> {t('queueManagement.view.processes.selectService')} </InputLabel>
                            <Select disabled={openTextField} value={selectedProcess} onChange={handleChangeSelect}>
                                {processOptions.map((opt, idx) => {
                                    return (<MenuItem value={opt.value} key={idx}> {opt.label} </MenuItem>);
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={!isMobile ? 2 : 12}>
                        <DialogActions>
                            <Button disabled={!selectedProcess} variant="outlined" onClick={() => createNewServiceRow()} color="primary">
                                {t('common.save')}
                            </Button>
                        </DialogActions>
                    </Grid>
                </Grid>
            ) : null}
            <Grid container>
                <Grid item xs={1} className={classes.radioPosition}>
                    <FormControlLabel value="textarea" control={<Radio checked={openTextField} onChange={changeRadioValue}/>}/>
                </Grid>
                <Grid item xs={!isMobile ? 7 : 11}>
                    <FormControl fullWidth className={classes.processText}>
                        <TextField
                            disabled={!openTextField}
                            label={t('queueManagement.view.processes.processDescirption')}
                            multiline
                            value={processText}
                            onChange={handleChangeProcessText}
                        />
                    </FormControl>
                </Grid>
                {isMobile ? (<Grid item xs={1}></Grid>) : null}
                <Grid item xs={!isMobile ? 2 : 5}>
                    <TextField 
                        type="number"
                        min="1"
                        label={t('queueManagement.view.processes.duration')}
                        disabled={!processText} 
                        value={processDuration} 
                        onChange={handleChangeDuration}
                    />
                </Grid>
                <Grid item xs={!isMobile ? 2 : 6}>
                    <DialogActions>
                        <Button disabled={!processDuration} variant="outlined" onClick={() => createNewServiceRow()} color="primary">
                            {t('common.save')}
                        </Button>
                    </DialogActions>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default DialogCreateNewProcess;