/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Badge from '@material-ui/core/Badge';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useTranslation } from 'react-i18next';
import FormDialog from '../../../component/window/FormDialog';

const useStyles = makeStyles(theme => ({
    textField: {
        marginTop: theme.spacing(1)
    }
}));


function TextFieldWithTranslations (props) {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const { label, value, name, onChange, helperText, align, translationsname, translationvalue, ...other } = props;
    const [open, setOpen] = React.useState(false);
    let languages = i18n.options.whitelist.filter(l => { return l !== 'cimode'; });
    const values = translationvalue ? JSON.parse(translationvalue) : {};
    let count = languages.filter(l => {
        return values[l] ? true : false;
    }).length;
    const translationChange = (lang, val) => {
        values[lang] = val;
        onChange(translationsname, JSON.stringify(values));
    };
    
    const translationButton = () => {
        return (
                <InputAdornment position="end">
                    <Tooltip title={t('component.translationTextField.translations')}>
                        <IconButton onClick={() => {
                            setOpen(true);
                        }}>
                            <Badge color="primary" badgeContent={count}>
                                <Icon>g_translate</Icon>
                            </Badge>
                        </IconButton>
                    </Tooltip>
                </InputAdornment>
        );
    };
    return (
            <React.Fragment>
                <FormControl error={helperText ? true : false} {...other}>
                    <InputLabel>{label}</InputLabel>
                    <Input type={'text'} value={value} onChange={(e) => onChange(name, e.target.value)} name={name}
                        endAdornment={translationButton()}/>
                    <FormHelperText error={helperText ? true : false}>{helperText ? helperText : ''}</FormHelperText>
                </FormControl>
                <FormDialog open={open} maxWidth="sm" handleClose={() => {
                    setOpen(false);
                }} title={`${t('component.translationTextField.translations')}: ${label}`}>
                    {languages.map((lang, idx) => {
                        return (
                                <TextField key={idx} value={values[lang] ? values[lang] : ''} label={t('language.' + lang)}
                                    name={translationsname} fullWidth={true} className={classes.textField}
                                    onChange={(e) => translationChange(lang, e.target.value)}/>
                        );
                    })}
                </FormDialog>
            </React.Fragment>
    );
}

export default TextFieldWithTranslations;