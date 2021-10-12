import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCurrentChannelId, selectAllChannels } from '../channels/ChannelsSlice.jsx';

const MessagesHeader = ({ messagesCount }) => {
  const activeChannelId = useSelector(selectCurrentChannelId);
  const channels = useSelector(selectAllChannels);
  const currentChannel = channels.find((channel) => channel.id === activeChannelId);
  const { t } = useTranslation();

  return (
    <>
      {currentChannel && (
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              {`# ${currentChannel.name}`}
            </b>
          </p>
          <div>
            {t('key', { count: messagesCount })}
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesHeader;
