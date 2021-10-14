import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { wsContext } from '../../contexts/index.jsx';
import { selectAllChannels, currentChannelIdChanged } from '../channels/ChannelsSlice.jsx';

const Remove = (props) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const ws = useContext(wsContext);
  const { onHide, modalInfo } = props;
  const [defaultChannel] = channels;
  const defautlChannelId = defaultChannel.id;
  const [t] = useTranslation();

  return (
    <Modal show={modalInfo.isOpen} onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('removeModal.title')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {t('removeModal.body')}
        <Formik
          initialValues={{
            body: '',
          }}
          onSubmit={() => {
            const onSuccessCallbacks = [
              () => onHide(),
              () => dispatch(currentChannelIdChanged({ id: defautlChannelId })),
            ];
            ws.removeChannel(modalInfo.extra, { onSuccessCallbacks });
          }}
        >
          {() => (
            <Form>
              <div className="d-flex justify-content-end">
                <Button className="mr-2" variant="secondary" onClick={onHide}>
                  {t('removeModal.cancelButton')}
                </Button>
                <Button variant="danger" type="submit">
                  {t('removeModal.submitButton')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
