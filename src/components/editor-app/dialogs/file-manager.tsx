import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Dialog,
    DialogActions,
    Table,
    TableBody,
    TableHead,
    TableRow
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { EditorContext } from '../../../context-providers/editor-provider';
import { Doc } from '../../../types';
import { DialogContent } from './dialog-content';
import { DialogTitle } from './dialog-title';
import './file-manager.scss';
import { TableCell } from './table-cell';

library.add(faTrashAlt, faCheck);

export const FileManager = React.memo(() => {
    const { openDoc, docRepo, removeDoc } = useContext(EditorContext);
    const {
        isFileManagerOpen,
        setFileManagerOpen,
        setRemoveFileAlertOpen
    } = useContext(DialogContext);
    const [selectedDocId, setSelectedDocId] = useState<string>(
        docRepo.currentDoc.id
    );

    useEffect(() => {
        setSelectedDocId(docRepo.currentDoc.id);
    }, [docRepo.currentDoc.id]);

    const handleTableRowClick = (
        e: React.MouseEvent<HTMLElement>,
        doc: Doc
    ) => {
        setSelectedDocId(doc.id);
    };

    const handleClose = () => {
        setFileManagerOpen(false);
    };

    const handleRemove = (e: React.MouseEvent<HTMLElement>, doc: Doc) => {
        e.stopPropagation();
        setFileManagerOpen(false);
        setRemoveFileAlertOpen(true, doc);
    };

    const handleOpenFile = () => {
        openDoc(selectedDocId);
        setFileManagerOpen(false);
    };

    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            onClose={() => setFileManagerOpen(false)}
            open={isFileManagerOpen}
            fullWidth={true}
        >
            <DialogTitle onClose={handleClose}>
                My document Repository
            </DialogTitle>
            <DialogContent>
                <Table>
                    <colgroup>
                        <col width="1%" />
                        <col width="60%" />
                        <col width="38%" />
                        <col width="1%" />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>Selected</TableCell>
                            <TableCell>Document</TableCell>
                            <TableCell align="right">Last Modified</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {docRepo.sortedDocs.map(doc => (
                            <TableRow
                                key={doc.id}
                                hover={true}
                                onClick={(e: React.MouseEvent<HTMLElement>) => {
                                    return handleTableRowClick(e, doc);
                                }}
                            >
                                <TableCell component="th">
                                    {doc.id === selectedDocId && (
                                        <FontAwesomeIcon icon="check" />
                                    )}
                                </TableCell>
                                <TableCell component="th">
                                    {doc.docName}
                                </TableCell>
                                <TableCell align="right">
                                    {doc.friendlyLastModifiedTimespan} ago
                                </TableCell>
                                <TableCell align="center">
                                    <div
                                        className="remove-handler"
                                        onClick={(
                                            e: React.MouseEvent<HTMLElement>
                                        ) => {
                                            handleRemove(e, doc);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon="trash-alt"
                                            className="remove"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleOpenFile}
                    color="primary"
                >
                    Open
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
});
