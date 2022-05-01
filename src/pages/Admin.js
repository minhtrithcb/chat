import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const Admin = () => {

  return (
      <div>
        addmin
        <CKEditor
          editor={ ClassicEditor }
          config={{
            removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
          }}
          data=""
          onChange={ ( event, editor ) => {
              const data = editor.getData();
              console.log( { data } );
          }}
      />
    </div>
  )
}

export default Admin