import { connect } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const FilterForm = (props) => {
  const handleFilterChange = (event) => {
    const filter = event.target.value
    props.setFilter(filter)
  }

  return (
    <div>
      filter <input name='filter' onChange={handleFilterChange} />
    </div>
  )
}

const mapDispatchToProps = {
  setFilter
}

const ConnectedFilterForm = connect(
  null,
  mapDispatchToProps
)(FilterForm)
export default ConnectedFilterForm