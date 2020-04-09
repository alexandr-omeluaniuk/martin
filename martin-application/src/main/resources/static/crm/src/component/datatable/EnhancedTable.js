/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TablePagination from '@material-ui/core/TablePagination';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DataService from '../../service/DataService';
import { useTranslation } from 'react-i18next';
import StandardForm from '../form/StandardForm';
import DataTypeService from '../../service/DataTypeService';
import AppURLs from '../../constants/AppURLs';
import { NavLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
        root: {
            width: '100%'
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2)
        },
        table: {
            minWidth: 750
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1
        }
    }));

function EnhancedTable(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const {headCells, title, entity, metadata, permanentFilter, onLoadCallback } = props;
    // ----------------------------------------------- STATE ------------------------------------------------------------------------------
    const [rows, setRows] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [load, setLoad] = React.useState(true);
    const [order, setOrder] = React.useState(metadata.audit ? 'desc' : 'asc');
    const [orderBy, setOrderBy] = React.useState(metadata.audit ? 'lastModifiedDate' : 'id');
    const [selected, setSelected] = React.useState(new Set());
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [formOpen, setFormOpen] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    // ----------------------------------------------- FUNCTIONS --------------------------------------------------------------------------
    const reloadTable = () => {
        setLoad(!load);
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        reloadTable();
    };
    const massDeletion = () => {
        DataService.requestPut('/entity/delete/' + entity, Array.from(selected)).then(resp => {
            setSelected(new Set());
            reloadTable();
        });
    };
    const massDeactivation = () => {
        DataService.requestPut('/entity/deactivate/' + entity, Array.from(selected)).then(resp => {
            setSelected(new Set());
            reloadTable();
        });
    };
    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleCheckboxClick = (event, row) => {
        if (selected.has(row.id)) {
            selected.delete(row.id);
        } else {
            selected.add(row.id);
        }
        setSelected(new Set(selected));
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChangeDense = event => {
        setDense(event.target.checked);
    };
    const clearSelection = () => {
        setSelected(new Set());
    };
    const editEntry = (row) => {
        setEditId(row.id);
        setFormOpen(true);
    };
    const createEntry = () => {
        setEditId(null);
        setFormOpen(true);
    };
    const isSelected = row => selected.has(row.id);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length);
    // --------------------------------------------------- HOOKS --------------------------------------------------------------------------
    useEffect(() => {
        let filter = [];
        if (permanentFilter) {
            filter.push(permanentFilter);
        }
        DataService.requestPost('/entity/search/' + entity, {
            page: page + 1,
            pageSize: rowsPerPage,
            order: order,
            orderBy: orderBy,
            filter: filter
        }).then(resp => {
            if (resp) {
                setRows(resp.data);
                setTotal(resp.total);
                if (onLoadCallback) {
                    onLoadCallback(resp);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load, entity, page, rowsPerPage, order, orderBy]);
    useEffect(() => {
        return () => {
            DataService.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // --------------------------------------------------- RENDER -------------------------------------------------------------------------
    return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar numSelected={selected.size} title={title} reloadTable={reloadTable} 
                                          clearSelection={clearSelection} massDeletion={metadata.undeletable ? null : massDeletion}
                                          massDeactivation={metadata.undeletable ? massDeactivation : null} createEntry={createEntry}/>
                    <TableContainer>
                        <Table className={classes.table} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}
                            aria-label="enhanced table">
                            <EnhancedTableHead classes={classes} numSelected={selected.size} order={order} orderBy={orderBy} headCells={headCells}
                                onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={rows.length} entity={entity}/>
                            <TableBody>
                            {rows.map((row, index) => {
                                const isItemSelected = isSelected(row);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow hover role="checkbox" key={index} 
                                        aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}>
                                        <TableCell padding="checkbox">
                                            <NavLink to={AppURLs.links.entity + '/' + entity + '/' + row.id}>
                                                <Tooltip title={t('common.open')}>
                                                    <IconButton>
                                                        <Icon>open_in_new</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                            </NavLink>
                                        </TableCell>
                                        {headCells.map((column, i) => {
                                            let cellValue = DataTypeService.renderTableCell(entity, column, t, row);
                                            if (column.link) {
                                                cellValue = DataTypeService.renderLinkTableCell(entity, row, cellValue);
                                            }
                                            if (i === 0) {
                                                return (
                                                    <TableCell component="th" scope="row" padding="none" key={i} id={labelId}>
                                                        {cellValue}
                                                    </TableCell> 
                                                );
                                            } else {
                                                return (
                                                    <TableCell align={column.align} key={i}>{cellValue}</TableCell>
                                                );
                                            }
                                        })}
                                        <TableCell padding="checkbox">
                                            <Tooltip title={t('common.edit')}>
                                                <IconButton onClick={() => editEntry(row)}>
                                                    <Icon>edit</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }}
                                                    onClick={event => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        handleCheckboxClick(event, row)
                                                    }}/>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={headCells.length + 3} />
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={total} rowsPerPage={rowsPerPage}
                        page={page} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage}/> 
                </Paper>
                <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label={t('components.datatable.densePadding')} />
                <StandardForm open={formOpen} handleClose={() => {setFormOpen(false);}} entity={entity} afterSaveCallback={reloadTable} id={editId}/>
            </div>
    );
}

EnhancedTable.propTypes = {
    entity: PropTypes.string.isRequired,
    headCells: PropTypes.array.isRequired,
    title: PropTypes.string
};

export default EnhancedTable;
