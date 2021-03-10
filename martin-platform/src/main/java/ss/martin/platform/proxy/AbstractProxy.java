/*
 * The MIT License
 *
 * Copyright 2019 ss.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package ss.martin.platform.proxy;

import java.lang.System.Logger.Level;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * Abstract proxy.
 * @author ss
 * @param <T> origin object type.
 */
public abstract class AbstractProxy<T> implements InvocationHandler, ProxyMethods {
    /** Logger. */
    private static final System.Logger LOG = System.getLogger(AbstractProxy.class.getName());
    /** Origin object. */
    protected Object origin;
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (LOG.isLoggable(Level.TRACE)) {
            LOG.log(Level.TRACE, "{0} -> {1}",
                    this.origin.getClass().getSimpleName(), method.getName());
        }
        try {
            return doInvoke(proxy, method, args);
        } catch (InvocationTargetException ex) {
            LOG.log(Level.ERROR, "An unexpected invocation error!", ex.getTargetException());
            throw ex.getTargetException();
        } catch (Exception ex) {
            LOG.log(Level.ERROR, "An unexpected error in proxy!", ex);
            throw ex;
        }
    }
    /**
     * Create proxy.
     * @param origin origin object.
     * @param cl proxy interface.
     * @return proxy object.
     */
    public T proxying(T origin, Class<T> cl) {
        this.origin = origin;
        return (T) Proxy.newProxyInstance(cl.getClassLoader(), new Class[] { cl, ProxyMethods.class }, this);
    }
    /**
     * Create proxy with class loader.
     * @param origin origin object.
     * @param cl proxy interface.
     * @param classLoader class loader.
     * @return proxy object.
     */
    public T proxying(T origin, Class<T> cl, ClassLoader classLoader) {
        this.origin = origin;
        return (T) Proxy.newProxyInstance(classLoader, new Class[] { cl, ProxyMethods.class }, this);
    }
    @Override
    public Object getOrigin() {
        return this.origin;
    }
    /**
     * Invoke method body.
     * @param proxy proxy object.
     * @param method method.
     * @param args method arguments.
     * @return method result.
     * @throws Throwable error.
     */
    protected abstract Object doInvoke(Object proxy, Method method, Object[] args) throws Throwable;
}
