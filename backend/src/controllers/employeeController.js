import * as employeeModel from '../models/employeeModel.js'

async function getEmployees(req, res, next) {
  try {
    const employees = await employeeModel.getEmployees()

    res.status(200).json({
      success: true,
      data: employees,
    })
  } catch (error) {
    next(error)
  }
}

async function addEmployee(req, res, next) {
  try {
    const employee = await employeeModel.addEmployee(req.body)

    res.status(201).json({
      success: true,
      data: employee,
    })
  } catch (error) {
    next(error)
  }
}

async function updateEmployee(req, res, next) {
  try {
    const employee = await employeeModel.updateEmployee(req.params.id, req.body)

    res.status(200).json({
      success: true,
      data: employee,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const employee = await employeeModel.deleteEmployee(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: employee,
    })
  } catch (error) {
    next(error)
  }
}

export { getEmployees, addEmployee, updateEmployee, deleteEmployee }
