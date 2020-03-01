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

import { useTheme } from '@material-ui/core/styles';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from 'react-i18next';
import StandardForm from '../component/form/StandardForm';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ReactDOM from 'react-dom';

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
//import '../assets/css/fullcalendar-material.css';

function CalendarView(props) {
    const { metadata } = props;
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    let calendarRef = React.createRef();
    //console.log(metadata);
    // ----------------------------------------------- STATE ------------------------------------------------------------------------------
    const [update, setUpdate] = React.useState(false);
    const [formOpen, setFormOpen] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    const [predefinedValues, setPredefinedValues] = React.useState(null);
    // ----------------------------------------------- FUNCTIONS --------------------------------------------------------------------------
    const dateClick = (info) => {
        let map = new Map();
        map.set('start', info.date);
        map.set('end', info.date);
        setPredefinedValues(map);
        setFormOpen(true);
    };
    const changeView = (view) => {
        calendarRef.current.calendar.changeView(view);
        setUpdate(!update);
    };
    const aspectRatio = () => {
        let aspectRatio = 3;
        let container = document.getElementById('main-container');
        if (container) {
            let height = container.offsetWidth - theme.spacing(8);
            let width = window.innerHeight - (theme.spacing(10) + 64 + 72);
            aspectRatio = height / width;
        }
        return aspectRatio;
    };
    // ---------------------------------------------------- HOOKS -------------------------------------------------------------------------
    useEffect(() => {
        ReactDOM.render(
            <React.Fragment>
                <Tooltip title={t('common.back')}>
                    <IconButton color="secondary" onClick={() => {
                        calendarRef.current.calendar.prev();
                        setUpdate(!update);
                    }}>
                        <Icon>keyboard_arrow_left</Icon>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('common.forward')}>
                    <IconButton color="secondary" onClick={() => {
                        calendarRef.current.calendar.next();
                        setUpdate(!update);
                    }}>
                        <Icon>keyboard_arrow_right</Icon>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('common.today')}>
                    <IconButton color="secondary" variant="contained" onClick={() => {
                        calendarRef.current.calendar.today();
                        setUpdate(!update);
                    }}><Icon>today</Icon></IconButton>
                </Tooltip>
            </React.Fragment>,
        document.getElementsByClassName('fc-left')[0]);
        ReactDOM.render(
            <React.Fragment>
                <ButtonGroup color="secondary" variant="contained">
                    <Tooltip title={t('components.calendar.view.dayGridMonth')}>
                        <Button onClick={() => changeView('dayGridMonth')}><Icon>view_module</Icon></Button>
                    </Tooltip>
                    <Tooltip title={t('components.calendar.view.listWeek')}>
                        <Button onClick={() => changeView('listWeek')}><Icon>view_list</Icon></Button>
                    </Tooltip>
                    <Tooltip title={t('components.calendar.view.timeGridWeek')}>
                        <Button onClick={() => changeView('timeGridWeek')}><Icon>view_week</Icon></Button>
                    </Tooltip>
                </ButtonGroup>
            </React.Fragment>,
        document.getElementsByClassName('fc-right')[0]);
        if (calendarRef && calendarRef.current) {
            calendarRef.current.calendar.setOption('aspectRatio', aspectRatio());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });
    // ------------------------------------------------------------------------------------------------------------------------------------
    return (
            <React.Fragment>
                <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ]}
                    locale={i18n.language} aspectRatio={aspectRatio()} ref={calendarRef} events={[
                        { title: 'event 1', date: '2020-02-27' },
                        { title: 'event 2', date: '2020-02-28' }
                    ]} dateClick={dateClick} header={{
                        left: '',
                        center: 'title',
                        right: ''
                    }}/>
                <StandardForm open={formOpen} handleClose={() => {setFormOpen(false);}} entity={metadata.className}
                    predefinedValues={predefinedValues} afterSaveCallback={null} id={editId}/> 
            </React.Fragment>
    );
}

export default CalendarView;