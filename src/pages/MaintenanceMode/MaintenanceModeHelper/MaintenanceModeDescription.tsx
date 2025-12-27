import RichTextEditor from '../../../components/common/RichTextEditor/RichTextEditor';
import { ERROR_MESSAGES } from '../../../constant/ErrorMessages';
import { MaintenanceModeDescriptionInterface } from '../../../interface/MaintenanceMode';
import { isRichTextEditorIsEmpty } from '../../../utils/helper/HelperFunction';

function MaintenanceModeDescription(
  props: MaintenanceModeDescriptionInterface
) {
  const { description, showError, onEditorReady, setDescription } = props;

  const handelOnUpdateFunction = (data: string) => {
    setDescription((pervData) => ({ ...pervData, message: data }));
  };

  return (
    <div className='w-full'>
      <RichTextEditor
        name='text-editor'
        labelFieldName='Enter a message users will see during maintenance'
        isRequiredField
        handelOnUpdateFunction={handelOnUpdateFunction}
        showError={showError}
        onEditorReady={onEditorReady}
        errorMessage={
          showError
            ? isRichTextEditorIsEmpty(description)
              ? ERROR_MESSAGES.REQUIRED_FIELD_CAPITALIZED
              : ''
            : ''
        }
        feedContent={description}
        className='whitespace-pre-wrap'
      />
    </div>
  );
}

export default MaintenanceModeDescription;
