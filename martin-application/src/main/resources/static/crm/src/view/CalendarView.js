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

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from 'react-i18next';
import StandardForm from '../component/form/StandardForm';

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '../assets/css/fullcalendar-material.css';

function CalendarView(props) {
    const { metadata } = props;
    const { i18n } = useTranslation();
    //console.log(metadata);
    // ----------------------------------------------- STATE ------------------------------------------------------------------------------
    const [formOpen, setFormOpen] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    
    const dateClick = (info) => {
        console.log(info);
        setFormOpen(true);
    };
    console.log(metadata.className);
    return (
            <React.Fragment>
            <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ]}
                locale={i18n.language} aspectRatio={3} events={[
                    { title: 'event 1', date: '2020-02-27' },
                    { title: 'event 2', date: '2020-02-28' }
                ]} dateClick={dateClick}
            />
            <StandardForm open={formOpen} handleClose={() => {setFormOpen(false);}} entity={metadata.className} afterSaveCallback={null}
                id={null}/>       
            </React.Fragment>
    );
}

export default CalendarView;