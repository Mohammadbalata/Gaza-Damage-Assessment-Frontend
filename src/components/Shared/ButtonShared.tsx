import classNames from 'classnames'
import { IButtonProps } from '../../interfaces/props/IButtonProps';

const ButtonShared = (props: IButtonProps) => {
  const { type, className, ...rest } = props
  return (
    <button type={type} className={classNames('flex items-center justify-center', className)} onClick={rest.onClick}>{rest.label}</button>
  )
}

export default ButtonShared;