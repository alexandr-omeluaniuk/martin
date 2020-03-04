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
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from 'react-i18next';
import StandardForm from '../component/form/StandardForm';
import DataService from '../service/DataService';
import { SERVER_DATE_FORMAT, SERVER_DATETIME_FORMAT } from '../service/DataTypeService';
import moment from 'moment';
import Spinner from '../component/util/Spinner';

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
//import '../assets/css/fullcalendar-material.css';
import '../assets/css/calendar-view.css';

var calendarComponent;

const useStyles = makeStyles(theme => ({
    container: {
        position: 'relative'
    }
}));

function CalendarView(props) {
    const { metadata } = props;
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();
    let calendarRef = React.createRef();
    // ----------------------------------------------- STATE ------------------------------------------------------------------------------
    const [formOpen, setFormOpen] = React.useState(false);
    const [showSpinner, setShowSpinner] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    const [calendar, setCalendar] = React.useState(null);
    const [predefinedValues, setPredefinedValues] = React.useState(null);
    // ----------------------------------------------- FUNCTIONS --------------------------------------------------------------------------
    const dateClick = (info) => {
        let map = new Map();
        map.set('start', info.date);
        map.set('end', info.date);
        setPredefinedValues(map);
        setFormOpen(true);
    };
    const eventClick = (eventClickInfo) => {
        setEditId(eventClickInfo.event.extendedProps.raw.id);
        setFormOpen(true);
    };
    const aspectRatio = () => {
        let aspectRatio = 3;
        let container = document.getElementById('main-container');
        if (container) {
            let height = container.offsetWidth - theme.spacing(8);
            let width = window.innerHeight - (theme.spacing(10) + 64 + 96);
            aspectRatio = height / width;
        }
        return aspectRatio;
    };
    const events = (fetchInfo, successCallback, failureCallback) => {
        setShowSpinner(true);
        DataService.requestPost('/calendar/search', {
            classes: [metadata.className],
            from: moment(fetchInfo.start).format(SERVER_DATE_FORMAT),
            to: moment(fetchInfo.end).format(SERVER_DATE_FORMAT)
        }).then(resp => {
            let newEvents = [];
            resp.forEach(raw => {
                newEvents.push({
                    id: raw.id,
                    title: raw.eventTitle ? raw.eventTitle : '',
                    start: moment(raw.start, SERVER_DATETIME_FORMAT).toDate(),
                    end: moment(raw.end, SERVER_DATETIME_FORMAT).toDate(),
                    raw: raw
                });
            });
            successCallback(newEvents);
            setShowSpinner(false);
        });
    };
    const refetchEvents = () => {
        calendar.refetchEvents();
    };
    // ---------------------------------------------------- HOOKS -------------------------------------------------------------------------
    useEffect(() => {
        if (calendarRef && calendarRef.current) {
            calendarRef.current.calendar.setOption('aspectRatio', aspectRatio());
            setCalendar(calendarRef.current.calendar);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarRef]);
    useEffect(() => {
        return () => {
            setShowSpinner(false);
            DataService.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // ------------------------------------------------------------------------------------------------------------------------------------
    const renderCalendar = () => {
        if (!calendarComponent) {
            calendarComponent = (
                <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ]}
                    locale={i18n.language} ref={calendarRef} events={events} dateClick={dateClick} eventClick={eventClick}
                    header={{
                        left: 'today prev,next',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,listWeek'
                    }} views={{
                        dayGridMonth: {
                            buttonText: t('components.calendar.view.dayGridMonth')
                        },
                        listWeek: {
                            buttonText: t('components.calendar.view.listWeek')
                        },
                        timeGridWeek: {
                            buttonText: t('components.calendar.view.timeGridWeek')
                        }
                    }} buttonText={{
                        today: t('common.today')
                    }} eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit'
                    }}/>
            );
        }
        return calendarComponent;
    };
    return (
            <div className={classes.container}>
                {renderCalendar()}
                <StandardForm open={formOpen} handleClose={() => {setFormOpen(false);}} entity={metadata.className}
                        predefinedValues={predefinedValues} afterSaveCallback={refetchEvents} id={editId}/>
                <Spinner open={showSpinner}/>
            </div>
    );
}

export default CalendarView;