/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { createMuiTheme } from '@material-ui/core/styles';

import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';
import cyan from '@material-ui/core/colors/cyan';
import teal from '@material-ui/core/colors/teal';
import green from '@material-ui/core/colors/green';
import lightGreen from '@material-ui/core/colors/lightGreen';
import lime from '@material-ui/core/colors/lime';
import yellow from '@material-ui/core/colors/yellow';
import amber from '@material-ui/core/colors/amber';
import orange from '@material-ui/core/colors/orange';
import deepOrange from '@material-ui/core/colors/deepOrange';

export const COLORS = [
    [ { label: 'Red', color: red }, { label: 'Pink', color: pink }, { label: 'Purple', color: purple }, { label: 'Deep purple', color: deepPurple } ],
    [ { label: 'Indigo', color: indigo }, { label: 'Blue', color: blue }, { label: 'Light blue', color: lightBlue }, { label: 'cyan', color: cyan } ],
    [ { label: 'Teal', color: teal }, { label: 'Green', color: green }, { label: 'Light green', color: lightGreen }, { label: 'Lime', color: lime } ],
    [ { label: 'Yellow', color: yellow }, { label: 'Amber', color: amber }, { label: 'Orange', color: orange }, { label: 'Deep orange', color: deepOrange } ]
];

export function getColorByLabel(label) {
    const allColors = [];
    COLORS.forEach(row => {
        row.forEach(c => {
            allColors.push(c);
        });
    });
    const filtered = allColors.filter(c => c.label === label);
    return filtered.length > 0 ? filtered[0].color : null;
}

export function getPrimaryColor() {
    const saved = localStorage.getItem('primaryColor');
    return saved ? saved : 'Pink';
}

export function getSecondaryColor() {
    const saved = localStorage.getItem('secondaryColor');
    return saved ? saved : 'Deep orange';
}

export function getPrimaryColorContrast() {
    const saved = localStorage.getItem('primaryContrast');
    return saved ? parseInt(saved) : 800;
}

export function getSecondaryColorContrast() {
    const saved = localStorage.getItem('secondaryContrast');
    return saved ? parseInt(saved) : 500;
}

export function savePrimaryColorContrast(contrast) {
    localStorage.setItem('primaryContrast', contrast);
}

export function saveSecondaryColorContrast(contrast) {
    localStorage.setItem('secondaryContrast', contrast);
}

export function savePrimaryColor(color) {
    localStorage.setItem('primaryColor', color);
}

export function saveSecondaryColor(color) {
    localStorage.setItem('secondaryColor', color);
}

export function createTheme() {
    const primaryColor = getPrimaryColor();
    const secondaryColor = getSecondaryColor();
    const primaryContrast = getPrimaryColorContrast();
    const secondaryContrast = getSecondaryColorContrast();
    const theme = createMuiTheme({
        palette: {
            primary: getColorByLabel(primaryColor),
            secondary: getColorByLabel(secondaryColor)
        },
        typography: {
            useNextVariants: true
        }
    });
    theme.palette.primary.main = theme.palette.primary[primaryContrast];
    theme.palette.secondary.main = theme.palette.secondary[secondaryContrast];
    var sheetToBeRemoved = document.getElementById('calendar-view-css');
    if (sheetToBeRemoved) {
        var sheetParent = sheetToBeRemoved.parentNode;
        sheetParent.removeChild(sheetToBeRemoved);
    }
    var sheet = document.createElement('style');
    sheet.setAttribute("id", "calendar-view-css");
    sheet.innerHTML = calendarViewStyleSheet(theme);
    document.head.appendChild(sheet);
    return theme;
};

const calendarViewStyleSheet = function (theme) {
    let secondaryColor = theme.palette.secondary.main;
    let secondaryColorHover = theme.palette.secondary['400'];
    let secondaryColorActive = theme.palette.secondary['800'];
    return `
    .fc-button {
        box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
        color: #fff;
        background-color: ${secondaryColor};
        padding: 6px 16px;
        font-size: 0.875rem;
        min-width: 64px;
        box-sizing: border-box;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-family: "Roboto", "Helvetica", "Arial", sans-serif;
        font-weight: 500;
        line-height: 1.75;
        border-radius: 4px;
        letter-spacing: 0.02857em;
        text-transform: uppercase;
        border: 0;
        cursor: pointer;
        margin: 0;
        display: inline-flex;
        outline: 0;
        position: relative;
        align-items: center;
        user-select: none;
        vertical-align: middle;
        justify-content: center;
        text-decoration: none;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: transparent;
    }
    .fc-button:hover {
        background-color: ${secondaryColorHover};
    }
    .fc-button-primary:focus {
        box-shadow: none;
    }
    .fc-button-primary:disabled {
        color: rgba(0, 0, 0, 0.26);
        box-shadow: none;
        background-color: rgba(0, 0, 0, 0.12);
        cursor: default;
        pointer-events: none;
    }
    .fc-button:not(:disabled):active {
        color: #fff;
        background-color: ${secondaryColor};
        border: none;
    }
    .fc-button-primary:not(:disabled):active:focus, .fc-button-primary:not(:disabled).fc-button-active:focus {
        box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    }
    .fc-button-primary:not(:disabled).fc-button-active {
        color: #fff;
        background-color: ${secondaryColorActive};
        cursor: default;
        pointer-events: none;
    }
    .fc-event {
        box-shadow: 0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(76,175,80,.4);
        border-radius: 0px;
        background-color: #4caf50;
        border: 1px solid #208400;
    }
    .fc-event:hover {
        cursor: pointer;
    }
    `;
};