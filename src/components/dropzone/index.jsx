// TODO change this to the standalone Fine Uploader DnD module once https://github.com/FineUploader/fine-uploader/issues/1605 is complete
import qq from 'fine-uploader'
import React, { Component, PropTypes } from 'react'

class DropzoneElement extends Component {
    static propTypes = {
        children: PropTypes.object,
        dropActiveClassName: PropTypes.string,
        element: PropTypes.string,
        multiple: PropTypes.bool,
        onDropError: PropTypes.func,
        onProcessingDroppedFiles: PropTypes.func,
        onProcessingDroppedFilesComplete: PropTypes.func,
        uploader: PropTypes.object.isRequired
    };

    componentDidMount() {
        this._registerDropzone()
    }

    componentDidUpdate() {
        this._registerDropzone()
    }

    componentWillUnmount() {
        this._qqDropzone && this._qqDropzone.dispose()
    }

    render() {
        return (
            <div {...this.props}
                className={`fine-uploader-dropzone-container ${this.props.className || ''}`}
                 ref='dropZone'
            >
                { this.props.children }
            </div>
        )
    }

    _onDropError(errorCode, errorData) {
        console.error(errorCode, errorData)

        this.props.onDropError && this.props.onDropError(errorCode, errorData)
    }

    _onProcessingDroppedFilesComplete(files) {
        this.props.uploader.methods.addFiles(files)

        if (this.props.onProcessingDroppedFilesComplete) {
            this.props.onProcessingDroppedFilesComplete(files)
        }
    }

    _registerDropzone() {
        this._qqDropzone && this._qqDropzone.dispose()

        const dropzoneEl = this.props.element || this.refs.dropZone

        this._qqDropzone = new qq.DragAndDrop({
            allowMultipleItems: !!this.props.multiple,
            callbacks: {
                dropError: this._onDropError.bind(this),
                processingDroppedFiles: this.props.onProcessingDroppedFiles || function() {},
                processingDroppedFilesComplete: this._onProcessingDroppedFilesComplete.bind(this)
            },
            classes: {
                dropActive: this.props.dropActiveClassName || ''
            },
            dropZoneElements: [dropzoneEl]
        })
    }
}

DropzoneElement.propTypes = {
    multiple: PropTypes.bool
}

export default DropzoneElement
