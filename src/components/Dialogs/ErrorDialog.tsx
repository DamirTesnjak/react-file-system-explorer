import { JSX } from "react";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { ErrorDialogProps } from "../../types/ErrorDialogProps";
import { setState } from "../../app/appSlice";
import { ReducerItems } from "../../types/ReducerItems";
import { DialogComponent } from "./Dialog";

function ErrorDialog(props: ErrorDialogProps): JSX.Element {
  const { open } = props;
  const error = useSelector((state: { appState: ReducerItems }) => state.appState.error, shallowEqual);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setState({
      error: null,
    }));
  };

  const dialogContentText = (
    <>
      <p>{`Name: ${error?.code}`}</p>
      <p>{`Message: ${error?.message}`}</p>
      <p>{`Name: ${error?.name}`}</p>
    </>
  )

  return (
    <DialogComponent
      open={open}
      handleClose={handleClose}
      titleText="Error..."
      dialogContentText={dialogContentText}
    />
  );
}

export default ErrorDialog;
