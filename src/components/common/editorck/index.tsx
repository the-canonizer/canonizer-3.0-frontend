import { CKEditor } from '@ckeditor/ckeditor5-react';
import {Editor as ClassicEditor}  from 'ckeditor51/build/ckeditor'
import { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import isAuth from "../../../hooks/isUserAuthenticated";

interface editorstate {
    editorstate: string;
}

export interface editorchange {
    oneditorchange: (changedata: string | undefined) => void

}

export default function Editorck(props: (editorstate & editorchange)) {

    const {isUserAuthenticated} = isAuth();
    const [loadeditor, setLoadeditor] = useState(false)
    const [editordata, setEditordata] = useState('')

    useEffect(() => {

        if (typeof props.editorstate !== 'object')
            setEditordata(props.editorstate)
        else
            setEditordata("")

        // setTimeout(() => {
            setLoadeditor(true)
        // }, 100)
    }, [isUserAuthenticated])

    const editorConfiguration = {
        placeholder: "Write Your Statement Here",
        mediaEmbed:{previewsInData:true},
        toolbar: { shouldNotGroupWhenFull: true, 
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'superscript',
                'subscript',
                'numberedList',
                'bulletedList',
                'todoList',
                'alignment',
                '|',
                'fontSize',
                'fontColor',
                'fontBackgroundColor',
                'highlight',
                'fontFamily',
                '|',
                'indent',
                'outdent',
                '|',
                'link',
                'imageInsert',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                '|',
                'findAndReplace',
                'horizontalLine',
                'pageBreak',
                'specialCharacters',
                '|',
                'undo',
                'redo'
		],},
        image: {
            toolbar: ["imageTextAlternative", "imageStyle:inline", "imageStyle:block", "imageStyle:side", "linkImage"]
        },
    
    };


    return (
        <div>
            {loadeditor ?
                <CKEditor
                    config={editorConfiguration}
                    editor={ClassicEditor}
                    data={editordata}
                    onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                        writer.setStyle(
                            {"resize":
                            "vertical","height":"200px"," overflow-x":"auto"},
                            editor.editing.view.document.getRoot()
                        );
                        
                        });
                    }}
                    
                    onChange={(event, editor) => {
                        const data = editor?.getData();
                        props.oneditorchange(data)
                    }}
                />
                :
                <div><Skeleton /></div>
            }
        </div>
    )
}