/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { useTranslation } from 'react-i18next';

function EnhancedTableHead(props) {
    const { t } = useTranslation();
    const { classes, order, orderBy, onRequestSort, headCells, entity } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    headCells.forEach(hc => {
        hc.label = t('model.' + entity + '.field.'+ hc.id);
    });
    return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        
                    </TableCell>
                    {headCells.map((headCell, i) => (
                        <TableCell key={headCell.id} align={headCell.align}
                            padding={i === 0 ? 'none' : 'default'} sortDirection={orderBy === headCell.id ? order : false}>
                            {headCell.sortable ? (
                                <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}>
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            ) : headCell.label}
                        </TableCell>
                    ))}
                    <TableCell padding="checkbox">
                        
                    </TableCell>
                    <TableCell padding="checkbox">
                        
                    </TableCell>
                </TableRow>
            </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    entity: PropTypes.string.isRequired,
    headCells: PropTypes.array.isRequired   // 'right', 'left' allowed
};

export default EnhancedTableHead;
