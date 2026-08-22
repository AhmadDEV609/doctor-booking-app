
const error = async (err, req, res, next) => {
    console.log('Error', err.message)
    res.status(err.status || 500).json({
        message: err.message,
        success: false
    })
}


export { error }