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
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    canvas: {
        display: 'none'
    },
    badge: {
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        textAlign: 'center'
    }
}));

function AvatarInput(props) {
    const { value, label, onChange } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    let inputRef = React.createRef();
    let canvasRef = React.createRef();
    let avatarRef = React.createRef();
    const onFileSelected = (e) => {
        let files = inputRef.current.files;
        if (files[0]) {
            var reader = new FileReader();
            reader.addEventListener("load", function(e) {
                onChange(e.target.result);
            }); 
            reader.readAsDataURL(files[0]);
        }
    };
    // ------------------------------------------ HOOKS -----------------------------------------------------------------------------------
    useEffect(() => {
        if (value.indexOf('/') === 0) {
            let canvas = canvasRef.current;
            var ctx = canvas.getContext("2d");
            var image = document.getElementsByTagName('img', avatarRef.current)[0];
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            ctx.drawImage(document.getElementsByTagName('img', image)[0], 0, 0, image.naturalWidth, image.naturalHeight);
            onChange(canvas.toDataURL());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    // ------------------------------------------ RENDERING -------------------------------------------------------------------------------
    return (
            <Paper elevation={0}>
                <canvas className={classes.canvas} ref={canvasRef}/>
                {value ? (
                    <Badge title={t('common.clear')} badgeContent={'x'} color="secondary" className={classes.badge}
                            onClick={() => { onChange(null); }}>
                        <Avatar src={value} ref={avatarRef}/>
                    </Badge>
                ) : (
                    <Tooltip title={t('common.upload') + ' ' + label}>
                        <IconButton color="secondary" onClick={() => {
                            inputRef.current.click();
                        }}>
                            <Icon>account_circle</Icon>
                        </IconButton>
                    </Tooltip>
                )}
                <input type="file" ref={inputRef} hidden accept="image/x-png,image/gif,image/jpeg" onChange={onFileSelected}/>
            </Paper>
    );
}

export default AvatarInput;