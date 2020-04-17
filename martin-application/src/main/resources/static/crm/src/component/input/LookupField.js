/* 
 * The MIT License
 *
 * Copyright 2020 ss.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import DataService from '../../service/DataService';
import DataTypeService from '../../service/DataTypeService';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    menu: {
        zIndex: 1000
    }
}));

function LookupField(props) {
    const { field, label, value, helperText, name, error, onChange } = props;
    const inputRef = React.useRef();
    const classes = useStyles();
    const { t } = useTranslation();
    // ----------------------------------------------------- STATE ------------------------------------------------------------------------
    const [readOnly, setReadOnly] = React.useState(props.readOnly);
    const [displayedValue, setDisplayedValue] = React.useState('');
    const [searchResult, setSearchResult] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    // ----------------------------------------------------- FUNCTIONS --------------------------------------------------------------------
    const startSearch = (e) => {
        setReadOnly(false);
        inputRef.current.focus();
    };
    
    const doSearch = (e) => {
        let searchToken = e.target.value;
        setDisplayedValue(searchToken);
        if (searchToken.length > 1) {
            let filterOrigin = field.attributes.LOOKUP_FILTER ? field.attributes.LOOKUP_FILTER : [];
            let filter = JSON.parse(JSON.stringify(filterOrigin));
            filter.forEach(cond => {
                cond.predicates.forEach(predicate => {
                    predicate.value = predicate.value.replace('{val}', searchToken);
                });
            });
            DataService.requestPost('/entity/search/' + field.fieldType, {
                page: 1,
                pageSize: 5,
                order: field.attributes.LOOKUP_ORDER,
                orderBy: field.attributes.LOOKUP_ORDER_BY,
                filter: filter
            }).then(resp => {
                setSearchResult(resp.data);
                setOpen(true);
            });
        } else {
            setSearchResult([]);
            setOpen(false);
        }
    };
    
    const onItemSelect = (item) => {
        setOpen(false);
        onChange(field.name, item);
    };
    // -------------------------------------------------------- HOOKS ---------------------------------------------------------------------
    useEffect(() => {
        setDisplayedValue(DataTypeService.renderLookupField(field, value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    // -------------------------------------------------------- RENDERING -----------------------------------------------------------------
    const start = () => {
        return (
            <InputAdornment position="start">
                <Icon>{field.attributes.LOOKUP_ICON ? field.attributes.LOOKUP_ICON : 'extension'}</Icon>
            </InputAdornment>
        );
    };
    
    const end = () => {
        if (readOnly) {
            return (
                <InputAdornment position="end">
                    <Tooltip title={t('common.search')}>
                        <IconButton onClick={startSearch}>
                            <Icon>search</Icon>
                        </IconButton>
                    </Tooltip>
                </InputAdornment>
            );
        } else if (value) {
            return (
                <InputAdornment position="end">
                    <Tooltip title={t('common.clear')}>
                        <IconButton onClick={() => {
                            onChange(field.name, null);
                        }}>
                            <Icon>close</Icon>
                        </IconButton>
                    </Tooltip>
                </InputAdornment>
            );
        }
    };
    
    const menuItems = () => {
        if (searchResult.length === 0) {
            return (
                    <MenuItem disabled={true} onClick={setOpen(false)}>{t('common.noResults')}</MenuItem>
            );
        } else {
            const items = [];
            searchResult.forEach(item => {
                items.push((
                    <MenuItem key={item.id} onClick={() => onItemSelect(item)}>{DataTypeService.renderLookupField(field, item)}</MenuItem>
                ));
            });
            return items;
        }
    };
    
    return (
        <React.Fragment>
            <TextField label={label} fullWidth={true} value={displayedValue} InputProps={{
                startAdornment: start(),
                endAdornment: end(),
                readOnly: readOnly
            }} helperText={helperText} error={error} name={name} inputRef={inputRef} onChange={doSearch} autoComplete='off'/>
            <Popper open={open} anchorEl={inputRef.current} role={undefined} transition disablePortal={true}
                    placement={'bottom-start'} className={classes.menu}>
                {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
                        <Paper>
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <MenuList>
                                    {menuItems()}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}

export default LookupField;
