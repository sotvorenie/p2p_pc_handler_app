import {defineStore} from "pinia";
import {ref} from "vue";

const useConnectionStore = defineStore('connection', () => {

    // активна когда идет подключение
    const isConnecting = ref(false)
    // активна когда подключено
    const isConnected = ref(false)
    // текст ошибки подключения
    const connectionError = ref('')

    // IP-адрес
    const ipName = ref('')
    // порт
    const portName = ref('5555')

    // переменная для инициализации веб-сокета
    const socket = ref(null)

    // токен для аутентификации
    const authToken = import.meta.env.VITE_WS_TOKEN
    // аутентифицирован ли пользователь или нет
    const isAuthenticated = ref(false)

    // список сообщений в блоке подключения
    const connectionMessages = ref([])
    // список сообщений в блоке команд
    const mainMessages = ref([])

    // список всех установленных программ на пк
    const allPrograms = ref('')
    // информаци о ПК
    const PCInfo = ref()
    // показ информации в модальном окне (информации кроме списка установленных программ и инфы о ПК)
    const showInModalInfo = ref('')
    // последняя отправленная команада (для вывода в модальном окне нужной информации)
    const lastCommand = ref('')

    // подключение к ПК
    const connectToPc = async () => {
        isConnecting.value = true
        isConnected.value = false
        connectionError.value = ''
        isAuthenticated.value = false

        try {
            addLogConnection(
                `🔗 Подключение к ws://${ipName.value}:${portName.value}...`
            )

            if (socket.value) {
                socket.value.close()
            }

            socket.value = new WebSocket(`ws://${ipName.value}:${portName.value}`)

            socket.value.onopen = () => {
                isConnecting.value = false
                isConnected.value = true
                connectionError.value = ''
                addLogConnection('✅ Установлено соединение WebSocket!', 'success')

                authenticate()
            }

            socket.value.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)

                    if (data.status === 'success') {
                        if (data.type === 'auth_result') {
                            isAuthenticated.value = true
                            addLogConnection(`✅${data.data}`, 'success')
                            addLogConnection('🚀 Готово к отправке команд', 'success')
                        } else if (data.type === 'find_installed_programs') {
                            allPrograms.value = data.data
                            addLog('📋 Список установленных программ получен', 'success')
                        } else if (data.type === 'get_running_programs') {
                            showInModalInfo.value = data.data
                            addLog('🟢 Список запущенных программ получен', 'success')
                        } else if (data.type === 'get_system_info') {
                            PCInfo.value = data.data
                            addLog('💻 Информация о системе получена', 'success')
                        } else if (data.type === 'get_system_resources') {
                            showInModalInfo.value = data.data
                            addLog('📊 Состояние системы получено', 'success')
                        } else {
                            addLog(`${data.data}`, 'response')
                        }
                    } else if (data.status === 'error') {
                        if (data.type === 'auth_result') {
                            isAuthenticated.value = false
                            addLogConnection(`❌${data.data}`, 'success')
                        }
                        addLog(`❌ ${data.data}`, 'error')
                    } else if (data.status === 'connected') {
                        addLogConnection(`✅ ${data.data}`, 'success')
                    } else if (data.status === 'pong') {
                        addLog(`🏓 ${data.data}`, 'response')
                    }
                } catch (e) {
                    addLogConnection(`📨 Необработанное сообщение: ${event.data}`, 'response')
                    addLog(`📨 Необработанное сообщение: ${event.data}`, 'response')
                }
            }

            socket.value.onerror = () => {
                isConnecting.value = false
                isConnected.value = false
                connectionError.value = 'Соединение не удалось..'
                addLogConnection('❌ Ошибка подключения WebSocket', 'error')
            }

            socket.value.onclose = (event) => {
                isConnecting.value = false
                isConnected.value = false

                if (event.wasClean) {
                    addLogConnection('🔌 Соединение закрыто корректно', 'info')
                } else {
                    connectionError.value = 'Соединение потеряно'
                    addLogConnection('❌ Соединение неожиданно потеряно', 'error')
                }
            }

            // Таймаут подключения
            setTimeout(() => {
                if (!isConnected.value && isConnecting.value) {
                    isConnecting.value = false
                    connectionError.value = 'Тайм-аут соединения'
                    addLogConnection('❌ Тайм-аут соединения — сервер не отвечает', 'error')
                    if (socket.value) {
                        socket.value.close()
                    }
                }
            }, 5000)

        } catch (error) {
            isConnecting.value = false
            connectionError.value = 'Соединение не удалось'
            addLogConnection(`❌ Ошибка соединения: ${error}`, 'error')
        }
    }


    // аутентификация
    const authenticate = () => {
        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            return
        }

        sendCommand('auth', authToken)
        addLogConnection('🔐 Отправка запроса аутентификации...', 'info')
    }


    // отключение от ПК
    const disconnect = () => {
        if (socket.value) {
            socket.value.close()
        }
        isConnected.value = false
        isConnecting.value = false
        connectionError.value = ''
        isAuthenticated.value = false
        addLogConnection('🔌 Отключено от ПК', 'info')
    }

    // отправка команды
    const sendCommand = (command, data = null) => {
        if (!isConnected.value || !socket.value || !socket.value || socket.value.readyState !== WebSocket.OPEN) {
            addLogConnection('❌ Не подключен к ПК', 'error')
            return
        }

        try {
            const message = {
                command: command,
                data: data,
            }

            socket.value.send(JSON.stringify(message))
        } catch (error) {
            addLog(`❌ Не удалось отправить команду: ${error}`, 'error')
        }
    }

    // вывод сообщений в блоке команд
    const addLog = (message, type = 'info') => {
        const lines = message.split('\n')
        console.log(lines)

        lines.forEach(line => {
            if (line.trim()) {
                mainMessages.value.unshift({
                    time: new Date().toLocaleTimeString(),
                    text: line.trim(),
                    type: type
                })
            }
        })
    }

    // вывод сообщений в блоке подключения
    const addLogConnection = (message, type = 'info') => {
        const lines = message.split('\n')
        lines.forEach(line => {
            if (line.trim()) {
                connectionMessages.value.unshift({
                    time: new Date().toLocaleTimeString(),
                    text: line.trim(),
                    type: type
                })
            }
        })
    }

    return {
        isConnecting,
        isConnected,
        connectionError,

        ipName,
        portName,

        connectionMessages,
        mainMessages,

        allPrograms,
        showInModalInfo,
        PCInfo,
        lastCommand,

        connectToPc,
        disconnect,
        sendCommand,

        addLog,
        addLogConnection,
    }
})

export default useConnectionStore