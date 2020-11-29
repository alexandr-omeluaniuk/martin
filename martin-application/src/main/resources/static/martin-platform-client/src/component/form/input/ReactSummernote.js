import $ from 'jquery';
import 'summernote/dist/summernote-lite.min.js';
import 'summernote/dist/summernote-lite.min.css'; // import styles
import React, { useEffect } from 'react';

const randomUid = () => Math.floor(Math.random() * 100000);

function ReactSummernote(props) {
    const { options, onChange, value } = props;
    const [editor, setEditor] = React.useState(null);
    const [uid, setUID] = React.useState(randomUid());
    const [changeCount, setChangeCount] = React.useState(0);
    // ============================================================ HOOKS =================================================================
    useEffect(() => {
        if (editor === null) {
            let jeditor = $(`#${uid}`);
            jeditor.summernote(options);
            setEditor(jeditor);
            setUID(uid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);
    useEffect(() => {
        if (editor && changeCount === 0 && value) {
            editor.summernote('code', value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    useEffect(() => {
        if (editor) {
            editor.unbind("summernote.change");
            editor.on("summernote.change", function (e) {   // callback as jquery custom event
                setChangeCount(changeCount + 1);
                onChange(editor.summernote('code'));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onChange]);
    useEffect(() => {
        return () => {
            if (editor && editor.summernote) {
                editor.summernote('destroy');
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
            <textarea id={uid}></textarea>
    );
}

export default ReactSummernote;