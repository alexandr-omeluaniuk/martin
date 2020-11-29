import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactSummernote from './ReactSummernote';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
    label: {
        marginBottom: theme.spacing(1)
    }
}));

function Summernote (props) {
    const classes = useStyles();
    const { label, value, onChangeFieldValue, name, fullWidth, helperText, ...other } = props;
    const onChange = (content) => {
        onChangeFieldValue(name, content);
    };
    return (
        <FormControl fullWidth={fullWidth} error={helperText ? true : false} {...other}>
            <FormLabel className={classes.label}>{label}</FormLabel>
            <ReactSummernote value={value} onChange={onChange} options={{
                  height: 150,
                  toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['view', ['fullscreen', 'codeview']]
                  ]
                }}
            />
            {helperText ? (
                <FormHelperText>{helperText}</FormHelperText>
            ) : null}
        </FormControl>
    );
}

export default Summernote;