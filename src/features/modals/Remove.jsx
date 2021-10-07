import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { wsContext } from '../../contexts/index.jsx';
import { selectAllChannels } from '../channels/ChannelsSlice.jsx';

const Remove = (props) => {
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
            ws.removeChannel(modalInfo.extra, { onHide, defautlChannelId });
          }}
        >
          {() => (
            <Form>
              <Button variant="secondary" onClick={onHide}>
                {t('removeModal.cancelButton')}
              </Button>
              <Button variant="primary" type="submit">
                {t('removeModal.submitButton')}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
