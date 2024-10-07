import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { EditorState, ContentState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false },
)

const MyEditor = ({ value, onChange }) => {
    const [editorState, setEditorState] = useState(() =>
        value
            ? EditorState.createWithContent(ContentState.createFromText(value))
            : EditorState.createEmpty(),
    )

    useEffect(() => {
        if (value) {
            const contentState = ContentState.createFromText(value)
            setEditorState(EditorState.createWithContent(contentState))
        }
    }, [value])

    const onEditorStateChange = newState => {
        setEditorState(newState)
        const text = newState.getCurrentContent().getPlainText()
        onChange(text)
    }

    return (
        <div className="mt-0 border border-gray-300 rounded-md p-1">
            <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
            />
        </div>
    )
}

export default MyEditor
