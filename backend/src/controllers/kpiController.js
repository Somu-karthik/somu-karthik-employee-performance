const kpiModel = require('../models/kpiModel')

async function getKpis(req, res, next) {
  try {
    const kpis = await kpiModel.getKpis()

    res.status(200).json({
      success: true,
      data: kpis,
    })
  } catch (error) {
    next(error)
  }
}

async function getKpisByEmployeeId(req, res, next) {
  try {
    const kpis = await kpiModel.getKpisByEmployeeId(req.params.employee_id)

    res.status(200).json({
      success: true,
      data: kpis,
    })
  } catch (error) {
    next(error)
  }
}

async function createKpi(req, res, next) {
  try {
    const kpi = await kpiModel.createKpi(req.body)

    res.status(201).json({
      success: true,
      data: kpi,
    })
  } catch (error) {
    next(error)
  }
}

async function updateKpi(req, res, next) {
  try {
    const kpi = await kpiModel.updateKpi(req.params.id, req.body)

    res.status(200).json({
      success: true,
      data: kpi,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getKpis, getKpisByEmployeeId, createKpi, updateKpi }
